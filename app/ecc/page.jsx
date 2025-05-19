import ECCDots from "@/components/ecc/ecc_gs_figure";
import ECCLine from "@/components/ecc/ecc_line_figure";

export default function ECCPage() {
  return (
    <div className='flex flex-row p-[3rem] gap-[3rem]'>
      <div className='flex flex-col'>
        <ECCDots />
        <ECCLine />
      </div>
      <div className='flex flex-col'>
        <div>
          <p>Generator Point : (15, 13)</p>
          <p>Line : y^2 = x^3 + 7 mod 17</p>
        </div>
        <div>
          <p>Private Key :</p>
          <textarea />
        </div>
      </div>
    </div>
  );
}
