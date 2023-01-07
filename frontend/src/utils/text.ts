type OnUpdateCallback = (text: string) => void;

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const scrollLeft = (
  text: string,
  onUpdate: OnUpdateCallback,
  interval = 300,
  maxLen = 8
): Promise<void> => {
  const padding = "".padStart(maxLen, " ");
  const paddedText = padding + text + padding;

  return new Promise(async (resolve, reject) => {
    for (let cursor = 0; cursor < paddedText.length; cursor++) {
      onUpdate(paddedText.slice(cursor, paddedText.length));

      await sleep(interval);
    }

    resolve();
  });
};
