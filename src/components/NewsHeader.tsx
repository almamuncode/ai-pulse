interface NewsHeaderProps {
  count: number;
}

function NewsHeader({ count }: NewsHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary sm:text-sm">
          Latest updates
        </p>

        <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
          AI News
        </h2>

        <p className="mt-1 text-sm text-base-content/50">
          The latest stories from the AI world.
        </p>
      </div>

      <span className="badge badge-lg border-base-300 bg-base-100 px-4">
        {count} {count === 1 ? "story" : "stories"}
      </span>
    </div>
  );
}

export default NewsHeader;