<?php
declare(strict_types=1);

namespace Akeneo\Bundle\ElasticsearchBundle;

use Akeneo\Bundle\ElasticsearchBundle\IndexConfiguration\Loader;
use Elasticsearch\Client;
use Elasticsearch\Namespaces\IndicesNamespace;
use Pim\Bundle\CatalogBundle\Version;

/**
 * This class is meant to update an index mapping or can be used for an upgrade
 * @see https://www.elastic.co/guide/en/elasticsearch/reference/current/reindex-upgrade-inplace.html
 *
 * A little problem of synchronized data can happen during the reindex operation
 * It means that it cannot be executed while the prod is alive
 * Still it is faster than before!
 *
 * @author    Anael Chardan <anael.chardan@akeneo.com>
 * @copyright 2019 Akeneo SAS (http://www.akeneo.com)
 * @license   http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 */
final class UpdateIndexMapping
{
    public function updateIndexMapping(Client $client, string $indexNameOrAlias, Loader $indexConfiguration): void
    {
        // We don't care about the index name anymore as we use alias
        $newIndexName = $indexNameOrAlias . '_' . str_replace('.', '_', Version::VERSION) . '_' . time();

        $this
            ->createIndexReadyForNewConfiguration($client->indices(), $newIndexName, $indexConfiguration)
            ->moveData($client, $indexNameOrAlias, $newIndexName)
            ->resetIndexSettings($client->indices(), $newIndexName, $indexNameOrAlias)
            ->moveAliasAndRemoveOldIndex($client->indices(), $newIndexName, $indexNameOrAlias)
        ;
    }

    private function createIndexReadyForNewConfiguration(IndicesNamespace $indicesClient, string $newIndexName, Loader $indexConfiguration): UpdateIndexMapping
    {
        $body = $indexConfiguration->load()->buildAggregated();

        // That change makes the reindex faster
        $body['settings']['index']['number_of_replicas'] = 0;
        $body['settings']['index']['refresh_interval'] = -1;

        $indicesClient->create(['index' => $newIndexName, 'body' => $body]);

        return $this;
    }

    private function moveData(Client $client, string $oldIndexNameOrAlias, string $newIndexName): UpdateIndexMapping
    {
        $client->reindex([
            "wait_for_completion" => true,
            "body"                => [
                "source" => [
                    "index" => $oldIndexNameOrAlias,
                ],
                "dest"   => [
                    "index" => $newIndexName
                ]
            ]
        ]);

        return $this;
    }

    private function resetIndexSettings(IndicesNamespace $indicesClient, string $indexName, string $oldIndexNameOrAlias): UpdateIndexMapping
    {
        $oldIndexSettings = $indicesClient->getSettings(['index' => $oldIndexNameOrAlias]);
        $oldIndexSettings = array_shift($oldIndexSettings)['settings'];

        $indicesClient->putSettings([
            'index' => $indexName,
            'body' => [
                'index' => [
                    'refresh_interval' => $oldIndexSettings['index']['refresh_interval'] ?? null,
                    'number_of_replicas' => $oldIndexSettings['index']['number_of_replicas'] ?? 1,
                ]
            ]
        ]);

        return $this;
    }

    private function moveAliasAndRemoveOldIndex(IndicesNamespace $indicesClient, string $newIndexName, string $oldIndexNameOrAlias): UpdateIndexMapping
    {
        $aliasAlreadyExists = $indicesClient->existsAlias(['name' => $oldIndexNameOrAlias]);
        $realAliasName = $oldIndexNameOrAlias;
        $aliasName = $aliasAlreadyExists ? $oldIndexNameOrAlias : $oldIndexNameOrAlias . '_tmp';

        $indicesClient->updateAliases([
            'body' => [
                "actions" => [
                    [
                        "add" => [
                            "index" => $newIndexName,
                            "alias" => $aliasName,
                        ]
                    ],
                    [
                        "remove_index" => [
                            "index" => $oldIndexNameOrAlias
                        ]
                    ],
                ]
            ]
        ]);

        if (!$aliasAlreadyExists) {
            $indicesClient->updateAliases([
                'body' => [
                    "actions" => [
                        [
                            "remove" => [
                                "index" => $newIndexName,
                                "alias" => $aliasName,
                            ]
                        ],
                        [
                            "add" => [
                                "index" => $newIndexName,
                                "alias" => $realAliasName
                            ]
                        ],
                    ]
                ]
            ]);
        }

        $indicesClient->refresh(['index' => $newIndexName]);

        return $this;
    }
}
