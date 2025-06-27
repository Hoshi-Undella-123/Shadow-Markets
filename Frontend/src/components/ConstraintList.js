function ConstraintList({ constraints, selectedConstraints, onSelect }) {
  return (
    <div>
      <h2>Constraints</h2>
      {constraints.map(constraint => (
        <label key={constraint.id}>
          <input
            type="checkbox"
            checked={selectedConstraints.includes(constraint.id)}
            onChange={() => {
              if (selectedConstraints.includes(constraint.id)) {
                onSelect(selectedConstraints.filter(id => id !== constraint.id));
              } else {
                onSelect([...selectedConstraints, constraint.id]);
              }
            }}
          />
          {constraint.name}
        </label>
      ))}
    </div>
  );
}

export default ConstraintList;
