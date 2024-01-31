import * as P from '@konker.dev/effect-ts-prelude';
import type { FileType, Ref, TinyFileSystem } from '@konker.dev/tiny-filesystem-fp';
import type { TinyFileSystemError } from '@konker.dev/tiny-filesystem-fp/dist/lib/error';

import type { DirectoryData, FileData, TreeCrawlerData } from '../index';
import { TreeCrawlerDataType } from '../index';

export const DIRECTORIES_FIRST = true;
export const FILES_FIRST = false;

export function isFileData(data: TreeCrawlerData): data is FileData {
  return data._tag === TreeCrawlerDataType.File;
}

export function isDirectoryData(data: TreeCrawlerData): data is DirectoryData {
  return data._tag === TreeCrawlerDataType.Directory;
}

export const sortListingByFileType =
  (tfs: TinyFileSystem, directoriesFirst: boolean) =>
  (listing: Array<Ref>): P.Effect.Effect<never, TinyFileSystemError, Array<{ childPath: Ref; fileType: FileType }>> =>
    P.pipe(
      listing.map((childPath: Ref) =>
        P.pipe(
          tfs.getFileType(childPath),
          P.Effect.map((fileType) => ({ fileType, childPath }))
        )
      ),
      P.Effect.all,
      P.Effect.map((listingAndTypes) =>
        // eslint-disable-next-line fp/no-mutating-methods
        [...listingAndTypes].sort((a, b) =>
          directoriesFirst ? a.fileType.localeCompare(b.fileType) : b.fileType.localeCompare(a.fileType)
        )
      )
    );
