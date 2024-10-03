import React from 'react';

function Label({ data }) {

 

  return (
    <div>
      {data.map((v, i) => (
        <LabelComp key={i} data={v} />
      ))}
    </div>
  );
}

function LabelComp({ data }) {
  if (!data) return <></>;
  return (
    <div className="labels flex justify-between mt-3">
      <div className="flex gap-2 ">
        <div
          className="w-2 h-2 rounded py-3"
          style={{ background: data.color ?? '#f9c74f' }}
        ></div>
        <h5 className="text-md font-semibold text-shadow-md">{data.type ?? ''}</h5>
      </div>
      <h5 className="font-bold">₹ {data.percent ?? 0}</h5>
    </div>
  );
}

export default Label;
