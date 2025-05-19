import ECCDots from "@/components/ecc/ecc_gs_figure";
import ECCLine from "@/components/ecc/ecc_line_figure";

export default function ECCPage() {
  return (
    <div className='flex flex-row p-[3rem] gap-[3rem]'>
      <ECCDots />
      <ECCLine />
    </div>
  );
}
