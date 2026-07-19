# BakaSearch — MLQA 跨语言检索

生成时间：2026-07-19 19:21:13 UTC

## 摘要

| 指标 | 数值 |
|------|------|
| 纯 BM25 nDCG@10 | **0.1664** |
| +桥扩展 nDCG@10 | **0.1807** |
| 差值 | **+0.0143** |
| 排行榜排名（纯 BM25） | **#42 / 77** |
| 排行榜排名（+桥扩展） | **#41 / 77** |
| 总文档数 | 138636 |
| 总查询数 | 158029 |
| 索引吞吐 | 841 doc/s |
| 纯 BM25 搜索延迟 | 0.56 ms/query |
| +桥扩展搜索延迟 | 1.65 ms/query |
| 总耗时 | 810s (13.5 min) |

## 分语言对比

| 语种 | 纯 BM25 | +桥扩展 | 差值 | 搜索(ms/q) | 桥搜索(ms/q) |
|------|---------|--------|------|-----------|-------------|
| ara-ara | 0.2991 | 0.2632 | -0.0359 | 2.60 | 3.11 |
| ara-deu | 0.0020 | 0.0031 | +0.0011 | 0.21 | 0.86 |
| ara-eng | 0.0454 | 0.0412 | -0.0042 | 0.29 | 2.75 |
| ara-hin | 0.0146 | 0.0302 | +0.0156 | 0.16 | 0.95 |
| ara-spa | 0.0572 | 0.0656 | +0.0084 | 0.18 | 0.96 |
| ara-vie | 0.0538 | 0.0563 | +0.0025 | 0.26 | 1.06 |
| ara-zho | 0.0246 | 0.0710 | +0.0464 | 0.07 | 0.50 |
| deu-ara | 0.0310 | 0.0506 | +0.0196 | 0.14 | 0.47 |
| deu-deu | 0.5063 | 0.4849 | -0.0214 | 1.36 | 2.59 |
| deu-eng | 0.2428 | 0.2391 | -0.0037 | 0.59 | 2.38 |
| deu-hin | 0.0256 | 0.0707 | +0.0452 | 0.17 | 0.69 |
| deu-spa | 0.2868 | 0.3109 | +0.0240 | 0.28 | 0.90 |
| deu-vie | 0.2945 | 0.2849 | -0.0096 | 0.31 | 0.92 |
| deu-zho | 0.0681 | 0.1626 | +0.0945 | 0.08 | 0.37 |
| eng-ara | 0.0249 | 0.0378 | +0.0128 | 0.32 | 1.46 |
| eng-deu | 0.3320 | 0.3412 | +0.0092 | 0.76 | 3.00 |
| eng-eng | 0.5809 | 0.5023 | -0.0786 | 4.27 | 8.01 |
| eng-hin | 0.0248 | 0.0853 | +0.0605 | 0.34 | 2.13 |
| eng-spa | 0.2829 | 0.3218 | +0.0389 | 0.64 | 2.66 |
| eng-vie | 0.2950 | 0.2666 | -0.0284 | 0.73 | 2.94 |
| eng-zho | 0.0620 | 0.2082 | +0.1462 | 0.17 | 0.98 |
| hin-ara | 0.0182 | 0.0421 | +0.0238 | 0.14 | 0.64 |
| hin-deu | 0.0604 | 0.0869 | +0.0266 | 0.22 | 0.76 |
| hin-eng | 0.0502 | 0.0647 | +0.0145 | 0.30 | 2.27 |
| hin-hin | 0.4101 | 0.3665 | -0.0436 | 1.81 | 3.43 |
| hin-spa | 0.0542 | 0.0886 | +0.0344 | 0.19 | 0.81 |
| hin-vie | 0.0507 | 0.0600 | +0.0092 | 0.26 | 0.94 |
| hin-zho | 0.0360 | 0.1761 | +0.1402 | 0.06 | 0.50 |
| spa-ara | 0.0218 | 0.0473 | +0.0255 | 0.16 | 0.50 |
| spa-deu | 0.2785 | 0.2849 | +0.0064 | 0.36 | 1.12 |
| spa-eng | 0.2143 | 0.2378 | +0.0235 | 0.58 | 3.00 |
| spa-hin | 0.0256 | 0.0806 | +0.0550 | 0.19 | 0.94 |
| spa-spa | 0.4880 | 0.4758 | -0.0122 | 2.19 | 5.53 |
| spa-vie | 0.2628 | 0.2400 | -0.0228 | 0.41 | 1.23 |
| spa-zho | 0.0653 | 0.2053 | +0.1400 | 0.08 | 0.44 |
| vie-ara | 0.0169 | 0.0233 | +0.0064 | 0.18 | 0.75 |
| vie-deu | 0.3326 | 0.2681 | -0.0645 | 0.29 | 1.00 |
| vie-eng | 0.2021 | 0.1578 | -0.0443 | 0.49 | 3.06 |
| vie-hin | 0.0216 | 0.0428 | +0.0211 | 0.20 | 0.97 |
| vie-spa | 0.2767 | 0.2329 | -0.0438 | 0.28 | 1.17 |
| vie-vie | 0.5167 | 0.4331 | -0.0836 | 2.37 | 3.72 |
| vie-zho | 0.0598 | 0.1113 | +0.0515 | 0.09 | 0.61 |
| zho-ara | 0.0259 | 0.0372 | +0.0113 | 0.16 | 0.58 |
| zho-deu | 0.1340 | 0.1359 | +0.0019 | 0.25 | 0.67 |
| zho-eng | 0.0944 | 0.1065 | +0.0121 | 0.36 | 1.77 |
| zho-hin | 0.0247 | 0.0642 | +0.0395 | 0.17 | 0.67 |
| zho-spa | 0.1092 | 0.1463 | +0.0371 | 0.22 | 0.66 |
| zho-vie | 0.1173 | 0.1306 | +0.0133 | 0.32 | 0.93 |
| zho-zho | 0.6324 | 0.6125 | -0.0200 | 1.08 | 2.39 |
| **平均** | **0.1664** | **0.1807** | **+0.0143** | 0.56 | 1.65 |

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
| #41 | BakaSearch（+桥扩展） | 0.1807 ← |
| #42 | VPLabs/SearchMap_Preview | 0.1712 |
| #43 | BakaSearch（纯 BM25） | 0.1664 ← |
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

