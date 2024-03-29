import * as P from '@konker.dev/effect-ts-prelude';
import type { TinyFileSystem } from '@konker.dev/tiny-filesystem-fp';

import type { DirectoryData } from '../../index';
import type { TinyTreeCrawlerError } from '../../lib/error';

export const NoopTreeCrawlerDirectoryHandler = (
  _tfs: TinyFileSystem,
  _path: string,
  _level: number
): P.Effect.Effect<P.Option.Option<DirectoryData>, TinyTreeCrawlerError> => P.Effect.succeed(P.Option.none());
