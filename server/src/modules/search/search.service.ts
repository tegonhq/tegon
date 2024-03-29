/** Copyright (c) 2024, Tegon, all rights reserved. **/

import { Injectable } from '@nestjs/common';
import { VectorService } from 'modules/vector/vector.service';

@Injectable()
export default class SearchService {
  constructor(private vectorService: VectorService) {}

  async searchData(workspaceId: string, query: string) {
    const searchData = await this.vectorService.searchEmbeddings(
      `issues_${workspaceId}`,
      await this.vectorService.generateEmbedding(query),
      5,
    );

    console.log(searchData);

    return searchData;
  }
}
