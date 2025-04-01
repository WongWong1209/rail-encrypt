const MainPage = () => {
  let result =
    "abcdefghijklmnopqrstuvdddddyeuyiefiuhweihiuhowreuigiuheriughiuh";
  let trail_number = 4;

  const cells = [...result].map((c, index) => {
    let pos;
    if (Math.floor(index / 3) % 2 === 1) {
      // go up
      pos = trail_number - (index % (trail_number - 1)) - 1;
    } else {
      // go down
      pos = index % (trail_number - 1);
    }

    return (
      <div key={index} className='flex flex-col'>
        {Array.from({ length: trail_number }, (_, i) => (
          <div
            key={`${index}-${i}`}
            className='h-8 w-8 flex items-center justify-center border border-white/20'
          >
            {i === pos ? c : ""}
          </div>
        ))}
      </div>
    );
  });

  return (
    <div className='flex flex-col items-center gap-4 w-[100vw]'>
      <h1 className='font-black text-[1.5rem] mt-[1rem]'>
        Trail Encrypt & Decrypt
      </h1>
      <div className='flex flex-col'>
        <label htmlFor='plain-text'>Plain Text:</label>
        <textarea
          id='plain-text'
          className='border min-w-[30rem] min-h-[10rem] rounded-md border-white/50 p-2'
        />
        <button></button>
        <label>Trail Number:</label>
        <input
          type='number'
          className='border rounded-sm border-white/50 p-1'
          defaultValue={4}
        />
      </div>
      <div className='flex flex-row gap-3'>
        <button className='border rounded-lg p-2 cursor-pointer hover:bg-white/10 active:bg-white/20'>
          Encrypt
        </button>
        <button className='border rounded-lg p-2 cursor-pointer hover:bg-white/10 active:bg-white/20'>
          Decrypt
        </button>
      </div>
      <div>
        <textarea
          readOnly
          className='border min-w-[30rem] min-h-[10rem] rounded-md border-white/50 p-2'
        />
      </div>
      <div className='flex flex-row flex-wrap max-w-[80vw]'>{cells}</div>
    </div>
  );
};

export default MainPage;
