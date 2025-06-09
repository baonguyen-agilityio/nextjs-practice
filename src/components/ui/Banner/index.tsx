interface BannerProps {
  title: string;
  description?: string;
}

export function Banner({ title, description }: BannerProps) {
  return (
    <div className="bg-primary text-white py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-5xl md:text-5xl text-center">{title}</h1>
        <span className="block w-10 h-1 my-4 bg-secondary mx-auto"></span>
        <p className="text-lg md:text-xl text-white max-w-2xl mx-auto font-inter text-center">
          {description}
        </p>
      </div>
    </div>
  );
}
