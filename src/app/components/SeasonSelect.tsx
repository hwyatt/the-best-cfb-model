import Select from "react-select";

interface YearOption {
  label: string;
  value: string;
}

const SeasonSelect = ({ yearOpts, year, handleYearChange }: any) => {
  return (
    <Select
      value={yearOpts.find(
        (option: YearOption) => String(option.value) === String(year)
      )}
      options={yearOpts}
      onChange={handleYearChange}
      className="z-20"
    />
  );
};

export default SeasonSelect;
