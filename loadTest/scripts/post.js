import http from "k6/http";
import { sleep } from "k6";

export default function () {
  const post = {
    body: "posting",
  };

  http.post("http://localhost:8080/post", JSON.stringify(post), {
    headers: { "Content-Type": "application/json" },
  });

  sleep(1);
}
