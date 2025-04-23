import fs from 'fs';
import path from 'path';
import { Footballer } from '../models/footballer';

export class FootballerService {
  private footballers: Footballer[] = [];
  private dataLoaded: boolean = false;

  constructor() {
    this.loadFootballers();
  }

  private loadFootballers(): void {
    if (this.dataLoaded) return;

    try {
      const dataPath = path.join(__dirname, '../../data/footballers.json');
      const data = fs.readFileSync(dataPath, 'utf8');
      this.footballers = JSON.parse(data);
      this.dataLoaded = true;
      console.log(`Loaded ${this.footballers.length} footballers from data file`);
    } catch (error) {
      console.error('Error loading footballer data:', error);
      // Fallback to sample data if file loading fails
      this.loadSampleData();
    }
  }

  private loadSampleData(): void {
    // Sample data for development/testing
    this.footballers = [
      {
        id: '1',
        name: 'Lionel Messi',
        country: 'Argentina',
        club: 'Inter Miami',
        position: 'Forward',
        age: 36,
        imageUrl: 'https://example.com/messi.jpg',
        attributes: {
          pace: 85,
          shooting: 92,
          passing: 91,
          dribbling: 95,
          defending: 38,
          physical: 65
        }
      },
      {
        id: '2',
        name: 'Cristiano Ronaldo',
        country: 'Portugal',
        club: 'Al-Nassr',
        position: 'Forward',
        age: 38,
        imageUrl: 'https://example.com/ronaldo.jpg',
        attributes: {
          pace: 87,
          shooting: 93,
          passing: 82,
          dribbling: 88,
          defending: 35,
          physical: 75
        }
      },
      {
        id: '3',
        name: 'Kylian Mbappé',
        country: 'France',
        club: 'Paris Saint-Germain',
        position: 'Forward',
        age: 24,
        imageUrl: 'https://example.com/mbappe.jpg',
        attributes: {
          pace: 97,
          shooting: 89,
          passing: 80,
          dribbling: 92,
          defending: 36,
          physical: 78
        }
      },
      {
        id: '4',
        name: 'Virgil van Dijk',
        country: 'Netherlands',
        club: 'Liverpool',
        position: 'Defender',
        age: 32,
        imageUrl: 'https://example.com/vandijk.jpg',
        attributes: {
          pace: 81,
          shooting: 60,
          passing: 70,
          dribbling: 72,
          defending: 91,
          physical: 86
        }
      },
      {
        id: '5',
        name: 'Kevin De Bruyne',
        country: 'Belgium',
        club: 'Manchester City',
        position: 'Midfielder',
        age: 32,
        imageUrl: 'https://example.com/debruyne.jpg',
        attributes: {
          pace: 76,
          shooting: 86,
          passing: 93,
          dribbling: 88,
          defending: 64,
          physical: 78
        }
      }
    ];
    
    this.dataLoaded = true;
    console.log('Loaded sample footballer data');
  }

  public getAllFootballers(): Footballer[] {
    if (!this.dataLoaded) {
      this.loadFootballers();
    }
    return this.footballers;
  }

  public getFootballerById(id: string): Footballer | undefined {
    return this.footballers.find(footballer => footballer.id === id);
  }

  public getRandomFootballers(count: number = 10): Footballer[] {
    const allFootballers = this.getAllFootballers();
    
    // Shuffle array using Fisher-Yates algorithm
    const shuffled = [...allFootballers];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, count);
  }

  public filterFootballers(criteria: Partial<Footballer>): Footballer[] {
    return this.footballers.filter(footballer => {
      for (const [key, value] of Object.entries(criteria)) {
        if (key === 'attributes') {
          for (const [attrKey, attrValue] of Object.entries(criteria.attributes || {})) {
            if (footballer.attributes?.[attrKey] !== attrValue) {
              return false;
            }
          }
        } else if (footballer[key] !== value) {
          return false;
        }
      }
      return true;
    });
  }
} 