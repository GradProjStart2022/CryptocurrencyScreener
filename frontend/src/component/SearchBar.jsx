const SearchBar = (props) => {
  return (
    <div className="search-bar">
      <i className="fa fa-search"></i>
      <input
        type="text"
        className="form-control form-input"
        placeholder="Search..."
      />
    </div>
  );
};

export default SearchBar;
