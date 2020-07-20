module.exports = async function App(context) {
  // await context.sendText(context.event.text);
  // console.log(context.event);
  // if (context.event.isText) {
  //   await context.sendText(`您說的是: ${context.event.isText}`);
  // }

  //回覆文字
  await context.sendText(`您說的是: ${context.event.text}`);
  
  //回覆貼圖
  await context.sendSticker({ 
    // type: sticker,
    packageId: '11537',
    stickerId: '52002735',
  });

  //回覆圖片
  await context.sendImage({ 
    // type: sticker,
    originalContentUrl: 'https://image.shutterstock.com/image-photo/view-famous-pic-du-midi-260nw-1390800023.jpg',
    previewImageUrl: 'https://image.shutterstock.com/image-photo/view-famous-pic-du-midi-260nw-1390800023.jpg',
  });

  //回覆影片
  await context.sendVideo({
    originalContentUrl: 'https://example.com/video.mp4',
    previewImageUrl: 'https://image.shutterstock.com/image-photo/view-famous-pic-du-midi-260nw-1390800023.jpg',
  });

  //回復位址
  // await context.sendLocation({
  //   title: 'my location',
  //   address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
  //   latitude: 35.65910807942215,
  //   longitude: 139.70372892916203,
  // });

  //回覆Carousel
  const template = [
    {
      imageUrl: 'https://example.com/bot/images/item1.jpg',
      action: {
        type: 'postback',
        label: 'Buy',
        data: 'action=buy&itemid=111',
      },
    },
    {
      imageUrl: 'https://example.com/bot/images/item2.jpg',
      action: {
        type: 'message',
        label: 'Yes',
        text: 'yes',
      },
    },
    {
      imageUrl: 'https://example.com/bot/images/item3.jpg',
      action: {
        type: 'uri',
        label: 'View detail',
        uri: 'http://example.com/page/222',
      },
    },
  ];
  const altText = 'this is a image carousel template';
  await context.sendImageCarouselTemplate(altText, template);
};

// module.exports = async function App(context) {
//   // await context.sendText(context.event.text);
//   if (context.event.isPayload) {
//     await context.sendText(`received the payload: ${context.event.payload}`);
//   }
// };
