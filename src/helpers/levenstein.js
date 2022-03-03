const levenshtein = (string1, string2, costs) => {
  let i;
  let j;
  const l1 = string1.length;
  const l2 = string2.length;
  let flip;
  let ch;
  let chl;
  let ii;
  let ii2;
  let cost;

  const costsValue = costs || {};
  const cr = costsValue.replace || 1;
  const cri = costsValue.replaceCase || costsValue.replace || 1;
  const ci = costsValue.insert || 1;
  const cd = costsValue.remove || 1;

  const cutHalf = (flip = Math.max(l1, l2));

  const minCost = Math.min(cd, ci, cr);
  const minD = Math.max(minCost, (l1 - l2) * cd);
  const minI = Math.max(minCost, (l2 - l1) * ci);
  const buf = new Array(cutHalf * 2 - 1);

  for (i = 0; i <= l2; ++i) {
    buf[i] = i * minD;
  }

  for (i = 0; i < l1; ++i, flip = cutHalf - flip) {
    ch = string1[i];
    chl = ch.toLowerCase();

    buf[flip] = (i + 1) * minI;

    ii = flip;
    ii2 = cutHalf - flip;

    for (j = 0; j < l2; ++j, ++ii, ++ii2) {
      cost =
        ch === string2[j] ? 0 : chl === string2[j].toLowerCase() ? cri : cr;
      buf[ii + 1] = Math.min(buf[ii2 + 1] + cd, buf[ii] + ci, buf[ii2] + cost);
    }
  }
  return buf[l2 + cutHalf - flip];
};

const compareWords = (word1, word2) => {
  const diffLetterNumber = levenshtein(word1, word2);
  const moreLetter = Math.max(word1.length, word2.length);
  const mainWord = moreLetter === word1.length ? word1 : word2;
  return mainWord.length > 2 && mainWord.length / 3 >= diffLetterNumber;
};

export const compareProposition = (
  proposition1,
  proposition2,
  // procent = 90
) => {
  const words1 = proposition1.trim().split(" ");
  const words2 = proposition2.trim().split(" ");
  const similarWords = new Set();

  words1.forEach((w1) => {
    words2.forEach((w2) => {
      const str1 = w1.toLowerCase().trim();
      const str2 = w2.toLowerCase().trim();
      if (str1 && str2 && compareWords(str1, str2)) {
        similarWords.add(str1);
      }
    });
  });

  const moreProposition = Math.max(words1.length, words2.length);
  const mainProposition = moreProposition === words1.length ? words1 : words2;
  const diffProcent = 100 - (mainProposition.length - similarWords.size) * 10;
  return { similarWords, diffProcent } ;
};

export default levenshtein;
