import Helpers from '../helpers/helpers';
import { records } from '../data/data';

class Record {
  constructor(authorId, fName, lName, title, type, description, district,sector,cell, media) {
    this.id = Helpers.setId(records);
    this.createdOn = new Date().toLocaleString();
    this.authorId = authorId;
    this.authorName = `${fName} ${lName}`;
    this.title = title;
    this.type = type;
    this.description = description;
    this.district = district;
    this.sector = sector;
    this.cell = cell;
    this.status = 'pending';
    this.media = media;
  }
}

export default Record;
