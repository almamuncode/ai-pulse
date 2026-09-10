interface NewsHeaderProps {
  count: number;
}

function NewsHeader({ count }: NewsHeaderProps) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Latest updates
        </p>

        <h2 className="mt-1 text-3xl font-bold">
          AI News
        </h2>
      </div>

      <span className="badge badge-lg">
        {count} {count === 1 ? "story" : "stories"}
      </span>
    </div>
  );
}

export default NewsHeader;