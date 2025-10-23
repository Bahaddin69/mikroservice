import { Consumer, Producer } from "kafkajs";
import { CatalogService } from "./catalog.service";
import { MessageBroker } from "../utils/broker";

export class BrokerService {
    private producer: Producer | null = null; // Mesaj göndermek için producer objesi
    private consumer: Consumer | null = null; // Mesaj dinlemek için consumer objesi
    private catalogService: CatalogService; // Mesajları işlemek için CatalogService instance

    constructor(catalogService: CatalogService) {
        this.catalogService = catalogService; // CatalogService'i broker ile ilişkilendir
    }

    public async initializeBroker() {
        this.producer = await MessageBroker.connectProducer<Producer>(); // Producer'a bağlan
        this.producer.on("producer.connect", async () => {
            console.log("Catalog Service Producer connected successfully");  // Producer bağlandığında log
        });

        this.consumer = await MessageBroker.connectConsumer<Consumer>();  // Consumer'a bağlan
        this.consumer.on("consumer.connect", async () => {
            console.log("Catalog Service Consumer connected successfully"); // Consumer bağlandığında log
        });

        // Consumer'ı topic'e subscribe et ve gelen mesajları handleBrokerMessage ile işle
        // (Bir mesaj gelince, içeriğine bak → uygun işlemi yap mesela DB’ye yaz, servis çağır)
        await MessageBroker.subscribe(this.catalogService.handleBrokerMessage.bind(this.catalogService), // mesaj geldiğinde çalışacak handler
            "CatalogEvents" // dinlenecek topic
        );
    }
}
