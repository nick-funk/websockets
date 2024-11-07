import { sleep } from "k6";
import exec from "k6/execution";
import http from "k6/http";

const sampler =
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sem sapien, euismod id sapien ac, lobortis rutrum velit. Sed nibh ante, consequat id volutpat eu, posuere sed lorem. Interdum et malesuada fames ac ante ipsum primis in faucibus. Quisque ac iaculis ligula. Donec venenatis convallis mauris in interdum. Donec ornare pretium nisi ut vehicula. Mauris varius quis felis non tempor. Nunc non erat ligula. Proin rutrum lectus at turpis condimentum, tempor auctor leo tincidunt. Fusce lacinia tempor risus, sit amet auctor ante placerat non. Donec ut est ac diam imperdiet ultricies eget in risus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas mattis interdum sapien, a egestas turpis consectetur et.`.split(
    " "
  );
const createBody = () => {
  const endWordIndex = 1 + Math.random() * sampler.length - 2;
  return sampler.slice(0, endWordIndex).join(" ");
};

export default function () {
  const post = {
    body: [`post - ${exec.scenario.iterationInTest}`, createBody()].join(
      "<br/>"
    ),
  };

  http.post("http://localhost:8080/post", JSON.stringify(post), {
    headers: { "Content-Type": "application/json" },
  });

  sleep(Math.random() * 30);
}
