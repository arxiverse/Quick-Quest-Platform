import { Instance1, Instance2 } from "./test";

function Display1() {
  const DisplayInstance1 = Instance1().data;
  return (
    <div>
      <h1>{DisplayInstance1[0].id}</h1>
      <h1>{DisplayInstance1[0].name}</h1>
      <h1>{DisplayInstance1[0].description}</h1>
      <h1>{DisplayInstance1[0].date}</h1>
      <h1>{DisplayInstance1[0].status}</h1>
    </div>
  );
}

function Display2() {
  const DisplayInstance2 = Instance2().data;
  return (
    <div>
      <h1>{DisplayInstance2[0].id}</h1>
      <h1>{DisplayInstance2[0].name}</h1>
      <h1>{DisplayInstance2[0].description}</h1>
      <h1>{DisplayInstance2[0].date}</h1>
      <h1>{DisplayInstance2[0].status}</h1>
    </div>
  );
}

function NVIDIA_GTX_1050() {
  return (
    <div>
      <Display1 />
      <Display2 />
    </div>
  );
}

export default NVIDIA_GTX_1050;
