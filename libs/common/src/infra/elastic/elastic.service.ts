import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ElasticService {
  constructor(private readonly elasticSearchService: ElasticsearchService) {}

  async create(indexName: string, data: any) {
    await this.elasticSearchService.create({
      index: indexName,
      id: data.id.toString(),
      document: data,
    });
  }

  async search(indexName: string, query: string, fields?: string[]) {
    const result = await this.elasticSearchService.search({
      index: indexName,
      query: {
        multi_match: {
          query,
          fields,
        },
      },
    });

    return result.hits.hits.map((h) => h._source);
  }
}
