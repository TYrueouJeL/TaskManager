export default function SearchForm({ search, onSearch, placeholderContent, onSubmit, searchChamp }) {
    function handleChange(event) {
        onSearch({ ...search, [event.target.name]: event.target.value });
    }

    return (
        <form onSubmit={onSubmit || ((e) => e.preventDefault())}>
            <input
                type="text"
                name={searchChamp}
                value={search[searchChamp]}
                onChange={handleChange}
                placeholder={`Chercher ${placeholderContent}`}
                className="p-2 border border-gray-200 rounded-lg"
            />
        </form>
    );
}