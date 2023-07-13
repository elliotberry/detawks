export default function lowercase() {
  return {
    name: 'lowercase',
    process(value) {
      return value.toLowerCase();
    },
  };
}
