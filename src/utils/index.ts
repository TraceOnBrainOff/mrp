export enum Ghp {
  PRZEWIDYWANY_POPTY,
  PRODUKCJA,
  DOSTEPNE,
}

export enum Mrp {
  CALKOWITE_ZAPOTRZEBOWANIE,
  PLANOWANE_PRZYJECIA,
  PRZEWIDYWANE_NA_STANIE,
  ZAPOTRZEBOWANIE_NETTO,
  PLANOWANE_ZAMOWIENIA,
  PLANOWANE_PRZYJECIE_ZAMOWIEN,
}

export const transpose = (matrix: any[][]) => {
  return matrix[0]?.map((col, i) => matrix.map((row) => row[i]));
};

export const getX = (
  ghp: number[][],
  mrpPlanowanePrzyjecia: number[],
  mrpVariables: {
    czasRealizacji: number;
    naStanie: number;
    poziomBOM: number;
    wielkoscPartii: number;
  }
): number[][] => {
  const res = transpose(ghp).reduce((acc, val, index) => {
    return !val[Ghp.PRZEWIDYWANY_POPTY] && !val[Ghp.PRODUKCJA]
      ? [
          ...acc,
          [
            undefined,
            mrpPlanowanePrzyjecia[index] || 0,
            acc[index - 1]
              ? (acc[index - 1][Mrp.PRZEWIDYWANE_NA_STANIE] || 0) +
                (mrpPlanowanePrzyjecia[index] || 0)
              : mrpVariables.naStanie + (mrpPlanowanePrzyjecia[index] || 0),
            undefined,
            undefined,
            undefined,
          ],
        ]
      : index - 1 >= 0 &&
        acc[index - 1][Mrp.PRZEWIDYWANE_NA_STANIE] - val[Ghp.PRODUKCJA] < 0
      ? [
          ...acc,
          [
            val[Ghp.PRODUKCJA] || 0,
            mrpPlanowanePrzyjecia[index] || 0,
            mrpVariables.wielkoscPartii -
              ((val[Ghp.PRODUKCJA] || 0) -
                (index - 1 >= 0
                  ? acc[index - 1][Mrp.PRZEWIDYWANE_NA_STANIE] || 0
                  : mrpVariables.naStanie)) +
              (mrpPlanowanePrzyjecia[index] || 0),
            (val[Ghp.PRODUKCJA] || 0) -
              (acc[index - 1][Mrp.PRZEWIDYWANE_NA_STANIE] || 0),
            undefined,
            mrpVariables.wielkoscPartii,
          ],
        ]
      : [
          ...acc,
          [
            val[Ghp.PRODUKCJA] || 0,
            mrpPlanowanePrzyjecia[index] || 0,
            (index - 1 >= 0
              ? acc[index - 1][Mrp.PRZEWIDYWANE_NA_STANIE] || 0
              : mrpVariables.naStanie) -
              (val[Ghp.PRODUKCJA] || 0) +
              (mrpPlanowanePrzyjecia[index] || 0),
            undefined,
            undefined,
            undefined,
          ],
        ];
  }, []);

  res.forEach((item, index) => {
    if (
      item[Mrp.PLANOWANE_PRZYJECIE_ZAMOWIEN] &&
      index - mrpVariables.czasRealizacji >= 0
    ) {
      res[index - mrpVariables.czasRealizacji][Mrp.PLANOWANE_ZAMOWIENIA] =
        item[Mrp.PLANOWANE_PRZYJECIE_ZAMOWIEN];
    }
  });
  return res;
};

export const getY = (
  ghp: number[][],
  ghpVariables: {
    czasRealizacji: number;
    naStanie: number;
  }
): number[][] => {
  const a = transpose(ghp).reduce(
    (acc, val, idx) =>
      idx === 0
        ? [
            ...acc,
            [
              val[Ghp.PRZEWIDYWANY_POPTY] || 0,
              val[Ghp.PRODUKCJA] || 0,
              (val[Ghp.PRODUKCJA] || 0) -
                (val[Ghp.PRZEWIDYWANY_POPTY] || 0) +
                ghpVariables.naStanie,
            ],
          ]
        : [
            ...acc,
            [
              val[Ghp.PRZEWIDYWANY_POPTY] || 0,
              val[Ghp.PRODUKCJA] || 0,
              (val[Ghp.PRODUKCJA] || 0) -
                (val[Ghp.PRZEWIDYWANY_POPTY] || 0) +
                (acc[idx - 1][Ghp.DOSTEPNE] || 0),
            ],
          ],
    []
  );
  return transpose(a);
};

export const getZ = (
  ghp: number[][],
  ghpVariables: {
    czasRealizacji: number;
    naStanie: number;
  }
): number[][] => {
  const a = transpose(ghp).reduce(
    (acc, val, idx) =>
      idx === 0
        ? [
            ...acc,
            [
              val[Ghp.PRZEWIDYWANY_POPTY] || 0,
              val[Ghp.PRODUKCJA] || 0,
              (val[Ghp.PRODUKCJA] || 0) -
                (val[Ghp.PRZEWIDYWANY_POPTY] || 0) +
                ghpVariables.naStanie,
            ],
          ]
        : [
            ...acc,
            [
              val[Ghp.PRZEWIDYWANY_POPTY] || 0,
              val[Ghp.PRODUKCJA] || 0,
              (val[Ghp.PRODUKCJA] || 0) -
                (val[Ghp.PRZEWIDYWANY_POPTY] || 0) +
                (acc[idx - 1][Ghp.DOSTEPNE] || 0),
            ],
          ],
    []
  );
  return transpose(a);
};

export const getNogiMrp = (
  ghp: number[][],
  mrpPlanowanePrzyjecia: number[],
  mrpVariables: {
    czasRealizacji: number;
    naStanie: number;
    poziomBOM: number;
    wielkoscPartii: number;
  }
): any => {
  return getX(ghp, mrpPlanowanePrzyjecia, mrpVariables).map((val:any, index) => (index === 0 ? val*4 : val ))
};