interface Props {
  title: string;
  value: string;
  onEdit: (field: string, value: string) => void;
}
const Detail = ({ onEdit, title, value }: Props) => {
  return (
    <div className="my-5">
      <p className="text-sm text-[#666]">{title}: </p>
      <div className="flex items-center justify-between">
        <p>{value}</p>
        <button
          onClick={() => {
            onEdit(title, value);
          }}
          className="text-xs text-blue-700"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default Detail;
