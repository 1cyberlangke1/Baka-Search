# BakaSearch — MLQA 跨语言检索

生成时间：2026-07-19 13:57:09 UTC

## 摘要

| 指标 | 数值 |
|------|------|
| 纯 BM25 nDCG@10 | **0.1664** |
| +桥扩展 nDCG@10 | **0.1612** |
| 差值 | **-0.0053** |
| 排行榜排名（纯 BM25） | **#42 / 77** |
| 排行榜排名（+桥扩展） | **#42 / 77** |
| 总文档数 | 138636 |
| 总查询数 | 158029 |
| 索引吞吐 | 1070 doc/s |
| 纯 BM25 搜索延迟 | 0.42 ms/query |
| +桥扩展搜索延迟 | 0.58 ms/query |
| 总耗时 | 472s (7.9 min) |

## 分语言对比

| 语种 | 纯 BM25 | +桥扩展 | 差值 | 搜索(ms/q) | 桥搜索(ms/q) |
|------|---------|--------|------|-----------|-------------|
| ara-ara | 0.2991 | 0.2887 | -0.0105 | 1.83 | 1.92 |
| ara-deu | 0.0020 | 0.0019 | -0.0001 | 0.17 | 0.28 |
| ara-eng | 0.0454 | 0.0447 | -0.0007 | 0.25 | 0.71 |
| ara-hin | 0.0146 | 0.0161 | +0.0015 | 0.12 | 0.20 |
| ara-spa | 0.0572 | 0.0562 | -0.0010 | 0.15 | 0.30 |
| ara-vie | 0.0538 | 0.0534 | -0.0004 | 0.23 | 0.36 |
| ara-zho | 0.0246 | 0.0247 | +0.0001 | 0.05 | 0.09 |
| deu-ara | 0.0310 | 0.0290 | -0.0020 | 0.13 | 0.19 |
| deu-deu | 0.5063 | 0.4901 | -0.0162 | 1.14 | 1.31 |
| deu-eng | 0.2428 | 0.2320 | -0.0108 | 0.49 | 0.79 |
| deu-hin | 0.0256 | 0.0244 | -0.0012 | 0.14 | 0.21 |
| deu-spa | 0.2868 | 0.2747 | -0.0121 | 0.23 | 0.38 |
| deu-vie | 0.2945 | 0.2803 | -0.0142 | 0.23 | 0.31 |
| deu-zho | 0.0681 | 0.0685 | +0.0004 | 0.06 | 0.10 |
| eng-ara | 0.0249 | 0.0244 | -0.0005 | 0.26 | 0.42 |
| eng-deu | 0.3320 | 0.3159 | -0.0160 | 0.63 | 0.83 |
| eng-eng | 0.5809 | 0.5540 | -0.0270 | 3.14 | 3.72 |
| eng-hin | 0.0248 | 0.0245 | -0.0003 | 0.30 | 0.50 |
| eng-spa | 0.2829 | 0.2680 | -0.0149 | 0.55 | 1.05 |
| eng-vie | 0.2950 | 0.2802 | -0.0148 | 0.65 | 0.93 |
| eng-zho | 0.0620 | 0.0598 | -0.0021 | 0.15 | 0.26 |
| hin-ara | 0.0182 | 0.0178 | -0.0005 | 0.15 | 0.19 |
| hin-deu | 0.0604 | 0.0589 | -0.0015 | 0.19 | 0.28 |
| hin-eng | 0.0502 | 0.0479 | -0.0023 | 0.26 | 0.60 |
| hin-hin | 0.4101 | 0.3944 | -0.0157 | 1.45 | 1.60 |
| hin-spa | 0.0542 | 0.0534 | -0.0008 | 0.14 | 0.30 |
| hin-vie | 0.0507 | 0.0480 | -0.0027 | 0.21 | 0.33 |
| hin-zho | 0.0360 | 0.0369 | +0.0009 | 0.05 | 0.09 |
| spa-ara | 0.0218 | 0.0232 | +0.0014 | 0.13 | 0.19 |
| spa-deu | 0.2785 | 0.2688 | -0.0097 | 0.25 | 0.35 |
| spa-eng | 0.2143 | 0.2066 | -0.0077 | 0.41 | 0.85 |
| spa-hin | 0.0256 | 0.0248 | -0.0008 | 0.13 | 0.22 |
| spa-spa | 0.4880 | 0.4757 | -0.0124 | 1.52 | 1.71 |
| spa-vie | 0.2628 | 0.2540 | -0.0088 | 0.27 | 0.39 |
| spa-zho | 0.0653 | 0.0657 | +0.0003 | 0.06 | 0.10 |
| vie-ara | 0.0169 | 0.0188 | +0.0019 | 0.14 | 0.21 |
| vie-deu | 0.3326 | 0.3222 | -0.0104 | 0.22 | 0.34 |
| vie-eng | 0.2021 | 0.1953 | -0.0068 | 0.38 | 0.83 |
| vie-hin | 0.0216 | 0.0201 | -0.0016 | 0.15 | 0.25 |
| vie-spa | 0.2767 | 0.2673 | -0.0095 | 0.20 | 0.35 |
| vie-vie | 0.5167 | 0.5029 | -0.0137 | 1.63 | 1.78 |
| vie-zho | 0.0598 | 0.0584 | -0.0014 | 0.07 | 0.10 |
| zho-ara | 0.0259 | 0.0254 | -0.0005 | 0.13 | 0.18 |
| zho-deu | 0.1340 | 0.1303 | -0.0037 | 0.17 | 0.25 |
| zho-eng | 0.0944 | 0.0925 | -0.0019 | 0.25 | 0.57 |
| zho-hin | 0.0247 | 0.0239 | -0.0008 | 0.13 | 0.19 |
| zho-spa | 0.1092 | 0.1085 | -0.0007 | 0.15 | 0.29 |
| zho-vie | 0.1173 | 0.1160 | -0.0013 | 0.22 | 0.31 |
| zho-zho | 0.6324 | 0.6283 | -0.0042 | 0.75 | 0.81 |
| **平均** | **0.1664** | **0.1612** | **-0.0053** | 0.42 | 0.58 |

## 排行榜

| 排名 | 模型 | nDCG@10 |
|------|------|---------|
| #1 | Mira190/Euler-Legal-Embedding-V1 | 0.7289 |
| #2 | Qwen/Qwen3-Embedding-8B | 0.7249 |
| #3 | Octen/Octen-Embedding-8B | 0.7199 |
| #4 | Qwen/Qwen3-Embedding-4B | 0.6972 |
| #5 | Bytedance/Seed1.6-embedding-1215 | 0.6826 |
| #6 | ICT-TIME-and-Querit/BOOM_4B_v1 | 0.6710 |
| #7 | ICT-TIME-and-Querit/ICT-TIME-and-Querit-embedding-v1 | 0.6703 |
| #8 | Alibaba-NLP/gte-Qwen2-7B-instruct | 0.6568 |
| #9 | Cohere/Cohere-embed-multilingual-v3.0 | 0.6409 |
| #10 | BAAI/bge-m3 | 0.6285 |
| #11 | BidirLM/BidirLM-Omni-2.5B-Embedding | 0.6256 |
| #12 | OrdalieTech/Solon-embeddings-large-0.1 | 0.6165 |
| #13 | BidirLM/BidirLM-1.7B-Embedding | 0.6116 |
| #14 | HIT-TMG/KaLM-embedding-multilingual-mini-v1 | 0.6104 |
| #15 | Alibaba-NLP/gte-Qwen2-1.5B-instruct | 0.6069 |
| #16 | Lajavaness/bilingual-embedding-large | 0.6057 |
| #17 | GritLM/GritLM-7B | 0.6039 |
| #18 | BidirLM/BidirLM-1B-Embedding | 0.5930 |
| #19 | Cohere/Cohere-embed-multilingual-light-v3.0 | 0.5854 |
| #20 | Lajavaness/bilingual-embedding-base | 0.5831 |
| #21 | Qwen/Qwen3-Embedding-0.6B | 0.5831 |
| #22 | Alibaba-NLP/gte-multilingual-base | 0.5698 |
| #23 | Salesforce/SFR-Embedding-Mistral | 0.5685 |
| #24 | BidirLM/BidirLM-0.6B-Embedding | 0.5560 |
| #25 | Lajavaness/bilingual-embedding-small | 0.5546 |
| #26 | Linq-AI-Research/Linq-Embed-Mistral | 0.5528 |
| #27 | Salesforce/SFR-Embedding-2_R | 0.5520 |
| #28 | GritLM/GritLM-8x7B | 0.5510 |
| #29 | Alibaba-NLP/gte-Qwen1.5-7B-instruct | 0.5121 |
| #30 | Omartificial-Intelligence-Space/Arabic-Triplet-Matryoshka-V2_external | 0.5093 |
| #31 | BidirLM/BidirLM-270M-Embedding | 0.4880 |
| #32 | Omartificial-Intelligence-Space/Arabert-all-nli-triplet-Matryoshka | 0.4508 |
| #33 | Omartificial-Intelligence-Space/Arabic-all-nli-triplet-Matryoshka | 0.4278 |
| #34 | Omartificial-Intelligence-Space/Arabic-labse-Matryoshka | 0.4103 |
| #35 | HIT-TMG/KaLM-embedding-multilingual-mini-instruct-v1 | 0.4080 |
| #36 | NovaSearch/jasper_en_vision_language_v1 | 0.3969 |
| #37 | Omartificial-Intelligence-Space/Marbert-all-nli-triplet-Matryoshka | 0.3713 |
| #38 | NovaSearch/stella_en_1.5B_v5 | 0.3411 |
| #39 | Haon-Chen/speed-embedding-7b-instruct | 0.2744 |
| #40 | Omartificial-Intelligence-Space/Arabic-mpnet-base-all-nli-triplet | 0.2051 |
| #41 | VPLabs/SearchMap_Preview | 0.1712 |
| #42 | BakaSearch（纯 BM25） | 0.1664 ← |
| #43 | BakaSearch（+桥扩展） | 0.1612 ← |
| #44 | bigscience/sgpt-bloom-7b1-msmarco | 0.1430 |
| #45 | Cohere/Cohere-embed-english-v3.0 | 0.0880 |
| #46 | Jaume/gemma-2b-embeddings | 0.0596 |
| #47 | avsolatorio/GIST-large-Embedding-v0 | 0.0535 |
| #48 | NovaSearch/stella_en_400M_v5 | 0.0491 |
| #49 | BAAI/bge-large-en-v1.5 | 0.0482 |
| #50 | WhereIsAI/UAE-Large-V1 | 0.0454 |
| #51 | avsolatorio/GIST-Embedding-v0 | 0.0373 |
| #52 | BAAI/bge-base-en-v1.5 | 0.0345 |
| #53 | Cohere/Cohere-embed-english-light-v3.0 | 0.0312 |
| #54 | Snowflake/snowflake-arctic-embed-m-long | 0.0269 |
| #55 | avsolatorio/NoInstruct-small-Embedding-v0 | 0.0257 |
| #56 | Snowflake/snowflake-arctic-embed-m-v1.5 | 0.0257 |
| #57 | Snowflake/snowflake-arctic-embed-l | 0.0232 |
| #58 | Mihaiii/Ivysaur | 0.0230 |
| #59 | avsolatorio/GIST-small-Embedding-v0 | 0.0224 |
| #60 | BAAI/bge-small-en-v1.5 | 0.0223 |
| #61 | Snowflake/snowflake-arctic-embed-m | 0.0211 |
| #62 | abhinand/MedEmbed-small-v0.1 | 0.0203 |
| #63 | Snowflake/snowflake-arctic-embed-s | 0.0186 |
| #64 | aari1995/German_Semantic_STS_V2 | 0.0148 |
| #65 | Snowflake/snowflake-arctic-embed-xs | 0.0130 |
| #66 | Mihaiii/Squirtle | 0.0127 |
| #67 | Mihaiii/Wartortle | 0.0119 |
| #68 | Mihaiii/Venusaur | 0.0096 |
| #69 | ai-forever/ru-en-RoSBERTa | 0.0092 |
| #70 | Mihaiii/Bulbasaur | 0.0091 |
| #71 | brahmairesearch/slx-v0.1 | 0.0064 |
| #72 | DeepPavlov/rubert-base-cased-sentence | 0.0057 |
| #73 | Mihaiii/gte-micro-v4 | 0.0053 |
| #74 | Mihaiii/gte-micro | 0.0050 |
| #75 | ai-forever/sbert_large_mt_nlu_ru | 0.0031 |
| #76 | DeepPavlov/distilrubert-small-cased-conversational | 0.0022 |
| #77 | DeepPavlov/rubert-base-cased | 0.0014 |
| #78 | ai-forever/sbert_large_nlu_ru | 0.0014 |

