class Rating {
  constructor( consistency = 0, originality = 0, surprise = 0, thinking = 0, performance = 0, esthetic = 0, ambience = 0, music = 0) {
    this.consistency = consistency;
    this.originality = originality;
    this.surprise = surprise;
    this.thinking = thinking;
    this.performance = performance;
    this.esthetic = esthetic;
    this.ambience = ambience;
    this.music = music;
  }
}

export default Rating;