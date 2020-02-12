class CriterionAverageRating {
  constructor() {
    this.consistency = { count: 0, total: 0 };
    this.originality = { count: 0, total: 0 };
    this.surprise = { count: 0, total: 0 };
    this.thinking = { count: 0, total: 0 };
    this.performance = { count: 0, total: 0 };
    this.esthetic = { count: 0, total: 0 };
    this.ambience = { count: 0, total: 0 };
    this.music = { count: 0, total: 0 };
  }
}

export default CriterionAverageRating;