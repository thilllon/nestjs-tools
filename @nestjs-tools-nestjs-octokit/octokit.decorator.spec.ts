import { beforeAll, describe, expect, test } from '@jest/globals';
import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Octokit } from 'octokit';

import { InjectOctokit } from './octokit.decorator';
import { OctokitModule } from './octokit.module';

describe('OctokitDecorator', () => {
  @Injectable()
  class FooService {
    constructor(@InjectOctokit() private readonly octokit: Octokit) {}

    getOctokit() {
      return this.octokit;
    }
  }

  let foo: FooService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        OctokitModule.register({
          options: {
            auth: 'my-github-token',
          },
          plugins: [],
        }),
      ],
      providers: [FooService],
    }).compile();
    foo = module.get(FooService);
  });

  test('should be defined', () => {
    expect(foo.getOctokit()).toBeDefined();
    expect(foo.getOctokit()).toBeInstanceOf(Octokit);
  });
});
