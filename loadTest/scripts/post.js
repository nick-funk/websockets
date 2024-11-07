import { sleep } from "k6";
import exec from 'k6/execution';
import http from "k6/http";

export default function () {
  const post = {
    body: `post - ${exec.scenario.iterationInTest}`,
  };

  http.post("http://localhost:8080/post", JSON.stringify(post), {
    headers: { "Content-Type": "application/json" },
  });

  sleep(Math.random() * 30);
}
