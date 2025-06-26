export function calculateLOOK(requests, head, direction = "right") {
  let seekTime = 0;
  const sequence = [];
  let current = head;

  const left = requests.filter((r) => r < head).sort((a, b) => a - b);
  const right = requests.filter((r) => r >= head).sort((a, b) => a - b);

  if (direction === "right") {
    for (let r of right) {
      seekTime += Math.abs(current - r);
      sequence.push(r);
      current = r;
    }
    for (let i = left.length - 1; i >= 0; i--) {
      seekTime += Math.abs(current - left[i]);
      sequence.push(left[i]);
      current = left[i];
    }
  } else {
    for (let i = left.length - 1; i >= 0; i--) {
      seekTime += Math.abs(current - left[i]);
      sequence.push(left[i]);
      current = left[i];
    }
    for (let r of right) {
      seekTime += Math.abs(current - r);
      sequence.push(r);
      current = r;
    }
  }

  return { sequence, seekTime };
}
