import { useGetRunsForActionQuery } from 'services/action';

interface RunsProps {
  slug: string;
}

export function Runs({ slug }: RunsProps) {
  const { data } = useGetRunsForActionQuery(slug);
  console.log(data);

  return <h2>runs</h2>;
}
