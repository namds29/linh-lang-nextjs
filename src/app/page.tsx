import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <div className="container-fluid">
        <Header />
        <div className="bg-gray-200 h-[calc(100vh-56px)] w-full flex">
          <section
            id="sidebar"
            className="w-[16rem] h-full bg-red-300 p-2 text-black"
          >
            <div className="flex flex-col gap-4">
              <Button variant={"ghost"} className="justify-start">
                <img className="w-[1.25rem]" src="icon/icon-home.svg" alt="" />
                Tổng quan
              </Button>
              <Button variant={"ghost"} className="justify-start">
                <img className="w-[1.25rem]" src="icon/icon-cart.svg" alt="" />
                Đơn hàng
              </Button>
              <Button variant={"ghost"} className="justify-start">
                <img className="w-[1.25rem]" src="icon/icon-tag.svg" alt="" />
                Sản phẩm
              </Button>
            </div>
          </section>
          <section id="main-content" className="w-full p-4">
            <div className="flex justify-between">
              <div>Danh sách đơn hàng</div>
              <div className="flex gap-5">
                <p>Danh sách đơn hàng</p>
                <p>Danh sách đơn hàng</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
