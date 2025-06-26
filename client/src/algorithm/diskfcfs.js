export function calculateFCFS(requests, head) {
  let seekTime = 0;
  let current = head;
  const sequence = [];

  for (let req of requests) {
    seekTime += Math.abs(current - req);
    sequence.push(req);
    current = req;
  }

  return { sequence, seekTime };
}
