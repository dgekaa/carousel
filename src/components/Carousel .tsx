import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface InnerProps {
  count: number;
  left: number;
}

const Outer = styled.div`
    margin: 30px auto;
    width: 600px;
    height: 160px;
    overflow: hidden;
    border-radius: 5px;
    position: relative;
    box-shadow: 3px 3px 8px 0 rgba(0, 0, 0, 0.6);
  `,
  Inner = styled.div<InnerProps>`
    display: flex;
    width: ${({ count }) => `${count * 200}px`};
    height: 100%;
    transition: 0.2s ease transform;
    transform: ${({ left }) => `translateX(${left}px);`};
  `,
  Image = styled.div<{ url: string }>`
    width: 200px;
    height: 100%;
    background-image: ${({ url }) => `url(${url})`};
    background-size: cover;
    background-position: center;
  `,
  Left = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 30px;
    cursor: pointer;
    transition: 0.2s ease background;
    padding-left: 5px;
    &:hover {
      background: rgba(0, 0, 0, 0.4);
    }
    &::before {
      content: "";
      border: solid white;
      border-width: 0 2px 2px 0;
      display: inline-block;
      padding: 5px;
      transform: rotate(135deg);
      -webkit-transform: rotate(135deg);
    }
  `,
  Right = styled(Left)`
    left: auto;
    right: 0;
    padding-right: 10px;

    &::before {
      transform: rotate(-45deg);
      -webkit-transform: rotate(-45deg);
    }
  `;

const Carousel: React.FC = () => {
  const [photos, setPhotos] = useState<any[]>([]),
    [loading, setLoading] = useState<boolean>(false),
    [error, setError] = useState<boolean>(false),
    [left, setLeft] = useState<number>(0);

  const imageWidth = 200,
    galeryWidth = 600;

  useEffect(() => {
    setLoading(true);
    fetch("https://picsum.photos/v2/list")
      .then((res) => res.json())
      .then((photos) => {
        setLoading(false);
        setPhotos(photos);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, []);

  const getUnsplashUrl = (url: string): string =>
      `http://source.unsplash.com/${url.split("/photos/")[1]}`,
    toLeft = (): void => {
      setLeft((prev) => (prev !== 0 ? prev + galeryWidth : prev));
    },
    toRight = (): void => {
      setLeft((prev) =>
        (photos.length - 3) * -imageWidth < prev ? prev - galeryWidth : prev
      );
    };

  return (
    <Outer>
      <Inner count={photos.length} left={left}>
        {photos.map(({ url }) => (
          <Image key={url} url={getUnsplashUrl(url)} />
        ))}
      </Inner>

      {photos.length > 3 && (
        <>
          {left !== 0 && <Left onClick={toLeft} />}

          {(photos.length - 3) * -imageWidth < left && (
            <Right onClick={toRight} />
          )}
        </>
      )}
    </Outer>
  );
};

export default Carousel;
