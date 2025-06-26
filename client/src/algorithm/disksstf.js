export function calculateSSTF(requests, head) {
  let seekTime = 0;
  let current = head;
  const sequence = [];
  const pending = [...requests];

  while (pending.length > 0) {
    let nearest = pending.reduce((a, b) =>
      Math.abs(a - current) < Math.abs(b - current) ? a : b
    );

    seekTime += Math.abs(current - nearest);
    sequence.push(nearest);
    current = nearest;
    pending.splice(pending.indexOf(nearest), 1);
  }

  return { sequence, seekTime };
}
