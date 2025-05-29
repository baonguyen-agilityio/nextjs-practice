"use client";

import { Card, CardFooter, CardBody, Image, Button } from "@heroui/react";

export default function BookCard() {
  return (
    <Card isPressable shadow="sm" onPress={() => console.log("item pressed")}>
      <CardBody className="overflow-visible p-0 bg-mutedBackground">
        <Image
          alt="Card background"
          className="w-full object-cover p-10"
          src="https://m.media-amazon.com/images/I/419CqGgAdZL._SY445_SX342_.jpg"
          width="100%"
        />
      </CardBody>
      <CardFooter className="flex flex-col gap-2 text-left items-start">
        <div className="flex justify-between items-center w-full">
          <p className="text-title text-5xl">Atomic One’s</p>
          <p className="text-accent font-inter text-lg font-bold">$10.99</p>
        </div>
        <p className="text-description font-inter text-xs">
          Many variations of passages of Lorem Ipsum willing araise alteration in some form.
        </p>
        <div className="space-y-2">
          <Button
            radius="none"
            size="lg"
            color="default"
            variant="bordered"
            className="text-title text-sm"
          >
            Order Today
          </Button>
        </div>
      </CardFooter>
    </Card>
    // <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    //             <div className="aspect-[3/4] relative bg-gray-100">
    //               <Image
    //                 src={book.image}
    //                 alt={book.title}
    //                 fill
    //                 className="object-cover"
    //               />
    //             </div>
    //             <div className="p-6">
    //               <h3 className="font-bold text-lg mb-1 text-darkblue">{book.title}</h3>
    //               <p className="text-gray-600 mb-2">by {book.author}</p>
    //               <div className="flex items-center mb-3">
    //                 <span className="text-yellow-400">★★★★★</span>
    //                 <span className="text-sm text-gray-500 ml-1">({book.rating})</span>
    //               </div>
    //               <div className="flex items-center justify-between mb-4">
    //                 <div className="flex items-center gap-2">
    //                   <span className="font-bold text-darkblue">${book.price}</span>
    //                   <span className="text-sm text-gray-500 line-through">${book.originalPrice}</span>
    //                 </div>
    //                 <span className="text-xs text-accent bg-accent/10 px-2 py-1 rounded">
    //                   {book.category}
    //                 </span>
    //               </div>
    //               <div className="space-y-2">
    //                 <button className="w-full bg-accent text-darkblue font-semibold py-2 px-4 rounded hover:bg-yellow-300 transition-colors">
    //                   Add to Cart
    //                 </button>
    //                 <div className="flex gap-2">
    //                   <Button color="primary" variant="bordered">
    //                     Preview
    //                   </Button>
    //                   <Button color="primary">
    //                     Details
    //                   </Button>
    //                   <button className="flex-1 border border-darkblue text-darkblue py-2 px-4 rounded hover:bg-darkblue hover:text-white transition-colors">
    //                     Preview
    //                   </button>
    //                   <button className="flex-1 border border-darkblue text-darkblue py-2 px-4 rounded hover:bg-darkblue hover:text-white transition-colors">
    //                     Details
    //                   </button>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
  );
}
