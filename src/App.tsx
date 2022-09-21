import { useEffect, useState } from 'react';

interface Step {
  label: string;
  action: () => void;
}

const App: React.FC<{}> = () => {
  flipGrid(
    [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
      [13, 14, 15, 16],
    ],
    true,
    true
  );

  const [n, setN] = useState(1);

  const [grid, setGrid] = useState<number[][]>([
    [1, 1],
    [1, 0],
  ]);

  const baseGrid = [
    [1, 1],
    [1, 0],
  ];

  const [prevGrid, setPrevGrid] = useState<number[][]>([]);

  const step1 = () => {
    const newGrid: number[][] = [];
    for (let i = 0; i < 1 << (n + 1); ++i) {
      newGrid.push([]);
      for (let j = 0; j < 1 << (n + 1); ++j) {
        newGrid[i].push(0);
      }
    }

    const newPrevGrid = new Array<Array<number>>(grid.length);
    for (let i = 0; i < grid.length; ++i) {
      newPrevGrid[i] = [];
      for (let j = 0; j < grid[i].length; ++j) newPrevGrid[i].push(grid[i][j]);
    }

    setN(n + 1);
    setPrevGrid(newPrevGrid);
    setGrid(newGrid);
  };

  const step2 = () => {
    const newGrid: number[][] = [];
    for (let i = 0; i < grid.length; ++i) {
      newGrid.push([]);
      for (let j = 0; j < grid[i].length; ++j) newGrid[i].push(grid[i][j]);
    }

    placeGrid(newGrid, prevGrid, 0, 0);

    setGrid(newGrid);
  };

  const step3 = () => {
    const newGrid: number[][] = [];
    for (let i = 0; i < grid.length; ++i) {
      newGrid.push([]);
      for (let j = 0; j < grid[i].length; ++j) newGrid[i].push(grid[i][j]);
    }

    placeGrid(newGrid, flipGrid(prevGrid, false, true), 0, (1 << n) / 2);

    setGrid(newGrid);
  };

  const step4 = () => {
    const newGrid: number[][] = [];
    for (let i = 0; i < grid.length; ++i) {
      newGrid.push([]);
      for (let j = 0; j < grid[i].length; ++j) newGrid[i].push(grid[i][j]);
    }

    placeGrid(
      newGrid,
      flipGrid(spliceGrid(newGrid, 0, 0, 1 << (n - 1), 1 << n), true, false),
      1 << (n - 1),
      0
    );

    setGrid(newGrid);
  };

  const step5 = () => {
    const newGrid: number[][] = [];
    for (let i = 0; i < grid.length; ++i) {
      newGrid.push([]);
      for (let j = 0; j < grid[i].length; ++j) newGrid[i].push(grid[i][j]);
    }

    placeGrid(newGrid, baseGrid, (1 << n) / 2 - 1, (1 << n) / 2 - 1);

    setGrid(newGrid);
  };

  const step6 = () => {
    const newGrid: number[][] = [];
    for (let i = 0; i < grid.length; ++i) {
      newGrid.push([]);
      for (let j = 0; j < grid[i].length; ++j) newGrid[i].push(grid[i][j]);
    }

    const spliced = spliceGrid(
      newGrid,
      1 << (n - 1),
      1 << (n - 1),
      1 << (n - 1),
      1 << (n - 1)
    );

    const flipped = flipGrid(spliced, true, true);
    placeGrid(newGrid, flipped, 1 << (n - 1), 1 << (n - 1));

    setGrid(newGrid);
  };

  const steps: Step[] = [
    {
      label: 'Next n',
      action: step1,
    },
    {
      label: 'Place previous board',
      action: step2,
    },
    {
      label: 'Flip vertically',
      action: step3,
    },
    {
      label: 'Flip horizontally',
      action: step4,
    },
    {
      label: 'Place base case',
      action: step5,
    },
    {
      label: 'Flip the last quadrant',
      action: step6,
    },
  ];

  const [stepIndex, setStepIndex] = useState(0);

  function handleStep() {
    steps[stepIndex].action();
    setStepIndex((stepIndex + 1) % steps.length);
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          marginBottom: '2em',
        }}
      >
        <div
          style={{
            marginRight: '1em',
            marginLeft: 'auto',
          }}
        >
          n : {n}
        </div>
        <button
          onClick={() => handleStep()}
          style={{
            marginRight: 'auto',
          }}
        >
          {steps[stepIndex].label}
        </button>
      </div>

      <table
        border={1}
        style={{
          borderCollapse: 'collapse',
          margin: '0 auto 0 auto',
        }}
      >
        <tbody>
          {grid.map((row, i) => (
            <tr key={`row-${i}`}>
              {row.map((val, j) => (
                <td
                  key={`item-${i},${j}`}
                  style={{
                    backgroundColor:
                      val == 0 ? 'rgb(255, 255, 255)' : 'rgb(255, 0, 0)',

                    width: '2em',
                    height: '2em',
                  }}
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;

function flipGrid(
  grid: number[][],
  flipX: boolean,
  flipY: boolean
): number[][] {
  const newGrid: number[][] = [];
  for (
    let i = flipX ? grid.length - 1 : 0, p = 0;
    (flipX && i >= 0) || (!flipX && i < grid.length);
    i += flipX ? -1 : 1, ++p
  ) {
    newGrid[p] = [];
    for (
      let j = flipY ? grid[i].length - 1 : 0, q = 0;
      (flipY && j >= 0) || (!flipY && j < grid[i].length);
      j += flipY ? -1 : 1, ++q
    ) {
      newGrid[p][q] = grid[i][j];
    }
  }

  return newGrid;
}

function placeGrid(
  grid: number[][],
  mold: number[][],
  rowIndex: number,
  colIndex: number
) {
  for (let p = 0; p < mold.length; ++p) {
    for (let q = 0; q < mold[p].length; ++q) {
      const i = rowIndex + p;
      const j = colIndex + q;
      grid[i][j] = mold[p][q];
    }
  }
}

function spliceGrid(
  grid: number[][],
  rowIndex: number,
  colIndex: number,
  rows: number,
  cols: number
): number[][] {
  const result = new Array<Array<number>>(rows);
  for (let i = 0; i < rows; ++i) {
    result[i] = new Array<number>(cols);
  }

  for (let i = 0; i < rows; ++i) {
    for (let j = 0; j < cols; ++j) {
      result[i][j] = grid[rowIndex + i][colIndex + j];
    }
  }

  return result;
}
