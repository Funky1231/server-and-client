async function getResourceNest(url) {
  let pingId = 0;
  return async () => {
    let responseTime = new Date();
    const t0 = Date.now();
    await fetch(url, { mode: "no-cors" });
    const t1 = Date.now();

    const data = {
      pingId: pingId++,
      deliveryAttempt: 1,
      date: responseTime.getTime(),
      responseTime: t1 - t0,
    };
    return data;
  };
}

async function repeatedQuery(count, data) {
  const ran = Math.random();
  const res = await fetch("http://127.0.0.1:8080/data", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (count === 0 || res.ok) {
    return;
  }
  return setTimeout(() => repeatedQuery(count - 1), ran);
}

async function sendServer(url) {
  try {
    const req = await getResourceNest("https://nestjs.com/");
    const controller = new AbortController();
    const signal = controller.signal;

    setInterval(async () => {
      const data = await req();

      setTimeout(() => controller.abort(), 10000);
      data.pingId++;
      const res = await fetch(url, {
        method: "POST",
        signal: signal,
        body: JSON.stringify(data),
      });

      if (res.status === 500) {
        data.deliveryAttempt++;
        await repeatedQuery(5, data);
        data.deliveryAttempt = 1;
      }
      console.log(res);
      console.log(await res.text());
    }, 1000);
  } catch (error) {
    console.log(error);
  }
}

sendServer("http://127.0.0.1:8080/data");
