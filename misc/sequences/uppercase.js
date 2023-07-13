export default function uppercase() {
  return {
    name: 'uppercase',
    process(value) {
      return value.toUpperCase();
    },
  };
}
