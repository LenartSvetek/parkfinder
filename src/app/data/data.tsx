'use client'

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
    return Math.random() * (max - min + 1) + min;
}

export interface parking {
    idParking : number,
    level : 1 | 2 | 3,
    parkInfo : {
        totalSpaces : number,
        normalSpaces : number,
        freeSpaces : number,
        electricSpaces : number,
        freeElSpaces : number
    }
    location : {
        lat : number,
        lng : number
    }
    name : string
}

export function generateData(location : {lat : number, lng : number}) {
    const data : parking[] = [];
    console.log("generating")

    for(let i  = 0; i < randomInt(25, 50); i++){
        const pLat = randomFloat(45.53, 45.87);
        const pLng = randomFloat(13.48, 16.61);
        const level = randomInt(1, 3) as 1 | 2 | 3;
        const totalSpaces = randomInt(1, 50);
        const electricSpaces = totalSpaces > 15? randomInt(0, 5) : 0;
        const freeElSpaces = randomInt(0, 5);
        const normalSpaces = totalSpaces;
        const freeSpaces = randomInt(0, normalSpaces);

        data.push({
            idParking: i,
            level: level,
            parkInfo : {
                totalSpaces: totalSpaces,
                normalSpaces: normalSpaces,
                freeSpaces: freeSpaces,
                electricSpaces: electricSpaces,
                freeElSpaces: freeElSpaces
            },
            location : {
                lat: pLat,
                lng: pLng
            },
            name: "Parkirišče " + i
        })
    }

    data.push(
        {
            idParking: data.length,
            level: 1,
            parkInfo: {
                totalSpaces: 54,
                normalSpaces: 54,
                freeSpaces: 23,
                freeElSpaces: 5,
                electricSpaces: 8
            },
            location: {
              lat: location.lat - 0.002,
              lng: location.lng + 0.003
            },
            name: "All " + data.length
        }
    )

    data.push(
      {
          idParking: data.length,
          level: 2,
          parkInfo: {
              totalSpaces: 34,
              normalSpaces: 34,
              freeSpaces: 12,
              freeElSpaces: 3,
              electricSpaces: 5
          },
          location: {
            lat: location.lat - 0.005,
            lng: location.lng + 0.001
          },
          name: "Ball " + data.length
      }
  )

    data.push(
        {
            idParking: data.length,
            level: 3,
            parkInfo: {
                totalSpaces: 12,
                normalSpaces: 12,
                freeSpaces: 5,
                freeElSpaces: 0,
                electricSpaces: 5
            },
            location: {
            lat: location.lat + 0.001,
            lng: location.lng + 0.002
            },
            name: "Call " + data.length
        }
    )
    return data;
}