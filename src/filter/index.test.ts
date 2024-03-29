/* eslint-disable fp/no-mutation,fp/no-let */
import * as P from '@konker.dev/effect-ts-prelude';
import { MemFsTinyFileSystem } from '@konker.dev/tiny-filesystem-fp/dist/memfs';

import * as memFs1Fixture from '../test/fixtures/memfs-1.json';
import { FalseDirectoryFilter } from './directory/false-directory-filter';
import { TrueDirectoryFilter } from './directory/true-directory-filter';
import { ExtensionFileFilter } from './file/extension-file-filter';
import { FalseFileFilter } from './file/false-file-filter';
import { TrueFileFilter } from './file/true-file-filter';
import * as unit from './index';

describe('filter', () => {
  let memFsTinyFileSystem: MemFsTinyFileSystem;

  beforeAll(() => {
    memFsTinyFileSystem = MemFsTinyFileSystem(memFs1Fixture, '/tmp');
  });

  describe('sequenceFileFilters', () => {
    it('should work as expected', async () => {
      const actual = await P.Effect.runPromise(
        P.pipe([ExtensionFileFilter(['.txt']), TrueFileFilter], unit.sequenceFileFilters)(
          memFsTinyFileSystem,
          '/',
          'foo',
          'a.txt',
          1
        )
      );
      expect(actual).toStrictEqual(true);
    });

    it('should work as expected', async () => {
      const actual = await P.Effect.runPromise(
        P.pipe([ExtensionFileFilter(['.txt']), FalseFileFilter], unit.sequenceFileFilters)(
          memFsTinyFileSystem,
          '/',
          'foo',
          'a.csv',
          1
        )
      );
      expect(actual).toStrictEqual(false);
    });

    it('should work as expected', async () => {
      const actual = await P.Effect.runPromise(
        P.pipe([FalseFileFilter, FalseFileFilter], unit.sequenceFileFilters)(
          memFsTinyFileSystem,
          '/',
          'foo',
          'a.json',
          1
        )
      );
      expect(actual).toStrictEqual(false);
    });
  });

  describe('sequenceDirectoryFilters', () => {
    it('should work as expected', async () => {
      const actual = await P.Effect.runPromise(
        P.pipe(
          unit.sequenceDirectoryFilters([TrueDirectoryFilter, FalseDirectoryFilter])(
            memFsTinyFileSystem,
            '/',
            'foo',
            'foo',
            1
          )
        )
      );
      expect(actual).toStrictEqual(false);
    });

    it('should work as expected', async () => {
      const actual = await P.Effect.runPromise(
        P.pipe(
          unit.sequenceDirectoryFilters([TrueDirectoryFilter, TrueDirectoryFilter])(
            memFsTinyFileSystem,
            '/',
            'foo',
            'foo',
            1
          )
        )
      );
      expect(actual).toStrictEqual(true);
    });
  });
});
