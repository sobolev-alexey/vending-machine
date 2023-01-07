import { useSpring, animated } from "react-spring";

type ProductAnimationProps = {
  image: string;
  maxOffsetY: number;
  className?: string;
};

function ProductAnimation({
  image,
  maxOffsetY,
  className,
}: ProductAnimationProps) {
  const { t } = useSpring({
    config: { duration: 1500 },
    from: { t: [0, 1] },
    t: [maxOffsetY, 1.2],
  });

  return (
    <animated.div
      className={className}
      style={{
        backgroundImage: `url("${image}")`,
        transform: t.to(
          (...params: any) => `translateY(${params[0]}px) scale(${params[1]})`
        ),
      }}
    />
  );
}

export default ProductAnimation;