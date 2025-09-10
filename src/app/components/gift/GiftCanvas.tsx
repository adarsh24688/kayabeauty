// "use client";
// import { forwardRef } from "react";
// import useImage from "use-image";

// interface GiftCanvasProps {
//   designUrl: string;
//   message: string;
//   receiver: string;
//   selectedGift: string;
// }

// const GiftCanvas = forwardRef<any, GiftCanvasProps>(
//   ({ designUrl, message, receiver, selectedGift }, ref) => {
//     const [backgroundImage] = useImage(designUrl);

//     return (
//       <Stage width={600} height={400} ref={ref}>
//         <Layer>
//           {backgroundImage && (
//             <KonvaImage image={backgroundImage} width={600} height={400} />
//           )}
//           <Text
//             text={receiver}
//             x={50}
//             y={80}
//             fontSize={24}
//             fill="black"
//             draggable
//           />
//           <Text
//             text={message}
//             x={50}
//             y={180}
//             fontSize={24}
//             fill="black"
//             width={500}
//             draggable
//           />
//           <Text
//             text={`€${selectedGift || "50"}`}
//             x={50}
//             y={320}
//             fontSize={24}
//             fill="black"
//             draggable
//           />
//         </Layer>
//       </Stage>
//     );
//   }
// );

// GiftCanvas.displayName = "GiftCanvas";

// export default GiftCanvas;
