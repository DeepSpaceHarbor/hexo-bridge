const extensions = new Set([
  "wav",
  "bwf",
  "raw",
  "aiff",
  "flac",
  "m4a",
  "pac",
  "tta",
  "wv",
  "ast",
  "aac",
  "mp2",
  "mp3",
  "mp4",
  "amr",
  "s3m",
  "3gp",
  "act",
  "au",
  "dct",
  "dss",
  "gsm",
  "m4p",
  "mmf",
  "mpc",
  "ogg",
  "oga",
  "opus",
  "ra",
  "sln",
  "vox",
]);

export function isAudio(filePath: string) {
  const extension = filePath.split(".").pop() ?? "";
  return extensions.has(extension.toLowerCase());
}
