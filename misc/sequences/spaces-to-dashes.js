export default function spacesToDashes() {
    return {
      name: "spacesToDashes",
      process(value) {
        return value.replace(/ /g, "-");
      },
    };
  }
  