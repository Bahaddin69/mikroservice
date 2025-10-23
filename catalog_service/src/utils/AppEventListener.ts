import { EventEmitter } from "events";
import { ElasticSearchService } from "../services/elasticsearch.service";

// Olay (event) için payload tipini tanımlıyoruz
export interface EventPayload {
    event: "createProduct" | "updateProduct" | "deleteProduct"; // Olay türleri
    data: unknown; // Olayın taşıdığı veri
}

// EventEmitter'dan miras alan özel sınıfımız
export class AppEventListener extends EventEmitter {
    private static _instance: AppEventListener; // Tek bir instance singleton tutmak için

    private eventName: string = "ELASTIC_SEARCH_EVENT"; // Bütün olaylar bu isimle dinlenecek

    private constructor() {
        super(); // EventEmitter constructor'unu çalıştırıyoruz
    }

    // Singleton mantığı -> dışarıdan new kullanılamaz
    // Her zaman aynı instance döner
    static get instance() {
        return this._instance || (this._instance = new AppEventListener());
    }

    // Event yayınlama (notify = emit)
    notify(payload: EventPayload) {
        this.emit(this.eventName, payload);
    }

    // Event dinleme (listen = on)
    listen(elasticSearchInstance: ElasticSearchService) {
        this.on(this.eventName, (payload: EventPayload) => {
            console.log("Event received", payload);
            elasticSearchInstance.handleEvents(payload);
        });
    }
}
