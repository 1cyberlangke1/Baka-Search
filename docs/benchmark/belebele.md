# BakaSearch — Belebele 阅读理解检索

生成时间：2026-07-20 07:08:26 UTC

## 摘要

| 指标 | 数值 |
|------|------|
| 纯 BM25 nDCG@10 | **0.4811** |
| +桥扩展 nDCG@10 | **0.4705** |
| 差值 | **-0.0105** |
| 排行榜排名（纯 BM25） | **#51 / 89** |
| 排行榜排名（+桥扩展） | **#51 / 89** |
| 总文档数 | 109800 |
| 总查询数 | 109800 |
| 索引吞吐 | 3189 doc/s |
| 纯 BM25 搜索延迟 | 0.37 ms/query |
| +桥扩展搜索延迟 | 0.43 ms/query |
| 总耗时 | 378s (6.3 min) |

## 分语言对比

| 语种 | 纯 BM25 | +桥扩展 | 差值 | 搜索(ms/q) | 桥搜索(ms/q) |
|------|---------|--------|------|-----------|-------------|
| acm_Arab | 0.5015 | 0.4959 | -0.0056 | 0.30 | 0.31 |
| afr_Latn | 0.6334 | 0.6303 | -0.0031 | 0.34 | 0.40 |
| als_Latn | 0.5597 | 0.5622 | +0.0025 | 0.41 | 0.48 |
| amh_Ethi | 0.2650 | 0.2268 | -0.0382 | 0.37 | 0.40 |
| apc_Arab | 0.5470 | 0.5444 | -0.0026 | 0.30 | 0.32 |
| arb_Arab | 0.5375 | 0.5416 | +0.0041 | 0.29 | 0.34 |
| arb_Latn | 0.1371 | 0.1295 | -0.0077 | 0.35 | 0.43 |
| ars_Arab | 0.4499 | 0.4536 | +0.0037 | 0.28 | 0.34 |
| ary_Arab | 0.4463 | 0.4373 | -0.0091 | 0.34 | 0.38 |
| arz_Arab | 0.4658 | 0.4667 | +0.0009 | 0.30 | 0.33 |
| asm_Beng | 0.4209 | 0.3991 | -0.0217 | 0.38 | 0.41 |
| azj_Latn | 0.5458 | 0.5317 | -0.0142 | 0.39 | 0.43 |
| bam_Latn | 0.4412 | 0.4213 | -0.0199 | 0.43 | 0.50 |
| ben_Beng | 0.6103 | 0.6078 | -0.0025 | 0.27 | 0.33 |
| ben_Latn | 0.5468 | 0.5488 | +0.0020 | 0.35 | 0.44 |
| bod_Tibt | 0.0701 | 0.0503 | -0.0198 | 0.58 | 0.55 |
| bul_Cyrl | 0.6106 | 0.5935 | -0.0171 | 0.33 | 0.45 |
| cat_Latn | 0.6666 | 0.6548 | -0.0118 | 0.31 | 0.43 |
| ceb_Latn | 0.5191 | 0.5180 | -0.0011 | 0.37 | 0.42 |
| ces_Latn | 0.5951 | 0.6008 | +0.0056 | 0.29 | 0.33 |
| ckb_Arab | 0.3132 | 0.2996 | -0.0136 | 0.46 | 0.44 |
| dan_Latn | 0.6104 | 0.6069 | -0.0036 | 0.31 | 0.39 |
| deu_Latn | 0.6818 | 0.6866 | +0.0048 | 0.27 | 0.35 |
| ell_Grek | 0.4925 | 0.4762 | -0.0163 | 0.41 | 0.44 |
| eng_Latn | 0.6885 | 0.7002 | +0.0117 | 0.31 | 0.43 |
| est_Latn | 0.5401 | 0.5325 | -0.0076 | 0.29 | 0.33 |
| eus_Latn | 0.6079 | 0.6069 | -0.0010 | 0.36 | 0.40 |
| fin_Latn | 0.6291 | 0.6232 | -0.0058 | 0.29 | 0.35 |
| fra_Latn | 0.6623 | 0.6553 | -0.0070 | 0.36 | 0.43 |
| fuv_Latn | 0.1519 | 0.1706 | +0.0187 | 0.30 | 0.37 |
| gaz_Latn | 0.3751 | 0.3539 | -0.0212 | 0.40 | 0.46 |
| grn_Latn | 0.5159 | 0.5139 | -0.0020 | 0.40 | 0.47 |
| guj_Gujr | 0.3504 | 0.3340 | -0.0164 | 0.37 | 0.38 |
| hat_Latn | 0.4969 | 0.4890 | -0.0079 | 0.40 | 0.46 |
| hau_Latn | 0.3922 | 0.3793 | -0.0129 | 0.40 | 0.44 |
| heb_Hebr | 0.3348 | 0.3074 | -0.0275 | 0.36 | 0.41 |
| hin_Deva | 0.5339 | 0.5437 | +0.0098 | 0.32 | 0.45 |
| hin_Latn | 0.5333 | 0.5332 | -0.0001 | 0.32 | 0.38 |
| hrv_Latn | 0.6358 | 0.6207 | -0.0151 | 0.30 | 0.40 |
| hun_Latn | 0.6353 | 0.6289 | -0.0064 | 0.33 | 0.40 |
| hye_Armn | 0.1233 | 0.0973 | -0.0260 | 0.57 | 0.57 |
| ibo_Latn | 0.2734 | 0.2566 | -0.0168 | 0.45 | 0.50 |
| ilo_Latn | 0.5397 | 0.5202 | -0.0195 | 0.41 | 0.43 |
| ind_Latn | 0.6715 | 0.6654 | -0.0060 | 0.30 | 0.38 |
| isl_Latn | 0.5450 | 0.5270 | -0.0179 | 0.42 | 0.44 |
| ita_Latn | 0.6861 | 0.6747 | -0.0114 | 0.32 | 0.42 |
| jav_Latn | 0.6139 | 0.6121 | -0.0018 | 0.34 | 0.40 |
| jpn_Jpan | 0.7064 | 0.7043 | -0.0021 | 0.23 | 0.41 |
| kac_Latn | 0.3843 | 0.3615 | -0.0229 | 0.48 | 0.49 |
| kan_Knda | 0.4383 | 0.4157 | -0.0226 | 0.34 | 0.37 |
| kat_Geor | 0.2390 | 0.2160 | -0.0231 | 0.44 | 0.46 |
| kaz_Cyrl | 0.4684 | 0.4445 | -0.0239 | 0.40 | 0.46 |
| kea_Latn | 0.5102 | 0.5276 | +0.0174 | 0.33 | 0.42 |
| khk_Cyrl | 0.3630 | 0.3217 | -0.0413 | 0.47 | 0.59 |
| khm_Khmr | 0.3762 | 0.3657 | -0.0105 | 0.40 | 0.41 |
| kin_Latn | 0.4649 | 0.4425 | -0.0224 | 0.40 | 0.47 |
| kir_Cyrl | 0.5031 | 0.5012 | -0.0020 | 0.39 | 0.46 |
| kor_Hang | 0.6307 | 0.6277 | -0.0031 | 0.24 | 0.39 |
| lao_Laoo | 0.2606 | 0.2527 | -0.0079 | 0.46 | 0.45 |
| lin_Latn | 0.3468 | 0.3276 | -0.0192 | 0.37 | 0.44 |
| lit_Latn | 0.6457 | 0.6264 | -0.0192 | 0.34 | 0.39 |
| lug_Latn | 0.2830 | 0.2701 | -0.0129 | 0.39 | 0.47 |
| luo_Latn | 0.3843 | 0.3577 | -0.0266 | 0.37 | 0.50 |
| lvs_Latn | 0.6096 | 0.5962 | -0.0134 | 0.36 | 0.41 |
| mal_Mlym | 0.4972 | 0.4693 | -0.0280 | 0.33 | 0.38 |
| mar_Deva | 0.5598 | 0.5546 | -0.0052 | 0.28 | 0.36 |
| mkd_Cyrl | 0.5526 | 0.5293 | -0.0233 | 0.38 | 0.52 |
| mlt_Latn | 0.5618 | 0.5240 | -0.0378 | 0.40 | 0.49 |
| mri_Latn | 0.3068 | 0.2888 | -0.0180 | 0.42 | 0.47 |
| mya_Mymr | 0.2723 | 0.2642 | -0.0081 | 0.50 | 0.46 |
| nld_Latn | 0.6669 | 0.6645 | -0.0024 | 0.31 | 0.37 |
| nob_Latn | 0.6062 | 0.6109 | +0.0047 | 0.32 | 0.38 |
| npi_Deva | 0.4975 | 0.4855 | -0.0120 | 0.33 | 0.39 |
| npi_Latn | 0.4113 | 0.4164 | +0.0052 | 0.35 | 0.40 |
| nso_Latn | 0.3911 | 0.3824 | -0.0088 | 0.46 | 0.46 |
| nya_Latn | 0.3297 | 0.3258 | -0.0040 | 0.46 | 0.48 |
| ory_Orya | 0.0502 | 0.0363 | -0.0139 | 0.62 | 0.67 |
| pan_Guru | 0.1162 | 0.0934 | -0.0228 | 0.52 | 0.59 |
| pbt_Arab | 0.3727 | 0.3630 | -0.0097 | 0.40 | 0.39 |
| pes_Arab | 0.6203 | 0.6122 | -0.0081 | 0.30 | 0.35 |
| plt_Latn | 0.4909 | 0.4420 | -0.0489 | 0.47 | 0.52 |
| pol_Latn | 0.6149 | 0.6157 | +0.0007 | 0.32 | 0.39 |
| por_Latn | 0.6589 | 0.6592 | +0.0003 | 0.33 | 0.43 |
| ron_Latn | 0.6500 | 0.6437 | -0.0063 | 0.34 | 0.41 |
| rus_Cyrl | 0.6636 | 0.6653 | +0.0017 | 0.29 | 0.47 |
| shn_Mymr | 0.2511 | 0.2278 | -0.0234 | 0.66 | 0.62 |
| sin_Latn | 0.3317 | 0.3248 | -0.0069 | 0.44 | 0.46 |
| sin_Sinh | 0.3411 | 0.3175 | -0.0236 | 0.45 | 0.47 |
| slk_Latn | 0.6178 | 0.6046 | -0.0133 | 0.33 | 0.38 |
| slv_Latn | 0.5750 | 0.5726 | -0.0024 | 0.34 | 0.39 |
| sna_Latn | 0.4673 | 0.4513 | -0.0160 | 0.36 | 0.41 |
| snd_Arab | 0.3386 | 0.3252 | -0.0134 | 0.43 | 0.46 |
| som_Latn | 0.3359 | 0.3295 | -0.0064 | 0.44 | 0.47 |
| sot_Latn | 0.4070 | 0.3818 | -0.0252 | 0.43 | 0.49 |
| spa_Latn | 0.5444 | 0.5667 | +0.0223 | 0.34 | 0.41 |
| srp_Cyrl | 0.5767 | 0.5549 | -0.0219 | 0.37 | 0.49 |
| ssw_Latn | 0.3494 | 0.3404 | -0.0090 | 0.39 | 0.46 |
| sun_Latn | 0.4882 | 0.4847 | -0.0035 | 0.35 | 0.41 |
| swe_Latn | 0.6796 | 0.6815 | +0.0019 | 0.30 | 0.39 |
| swh_Latn | 0.5902 | 0.5796 | -0.0106 | 0.37 | 0.38 |
| tam_Taml | 0.5980 | 0.5843 | -0.0137 | 0.29 | 0.30 |
| tel_Telu | 0.4430 | 0.4100 | -0.0330 | 0.34 | 0.37 |
| tgk_Cyrl | 0.4674 | 0.4300 | -0.0374 | 0.46 | 0.57 |
| tgl_Latn | 0.6074 | 0.5869 | -0.0205 | 0.40 | 0.43 |
| tha_Thai | 0.6382 | 0.6358 | -0.0024 | 0.28 | 0.37 |
| tir_Ethi | 0.1523 | 0.1294 | -0.0229 | 0.54 | 0.57 |
| tsn_Latn | 0.4494 | 0.4224 | -0.0270 | 0.43 | 0.45 |
| tso_Latn | 0.5329 | 0.5151 | -0.0178 | 0.44 | 0.50 |
| tur_Latn | 0.6298 | 0.6234 | -0.0064 | 0.25 | 0.35 |
| ukr_Cyrl | 0.6006 | 0.5722 | -0.0284 | 0.33 | 0.47 |
| urd_Arab | 0.5252 | 0.5260 | +0.0008 | 0.35 | 0.34 |
| urd_Latn | 0.2271 | 0.2426 | +0.0155 | 0.37 | 0.45 |
| uzn_Latn | 0.5884 | 0.5705 | -0.0179 | 0.38 | 0.44 |
| vie_Latn | 0.7092 | 0.6956 | -0.0136 | 0.28 | 0.38 |
| war_Latn | 0.6394 | 0.6283 | -0.0111 | 0.36 | 0.44 |
| wol_Latn | 0.2896 | 0.2971 | +0.0075 | 0.37 | 0.45 |
| xho_Latn | 0.3826 | 0.3700 | -0.0126 | 0.41 | 0.46 |
| yor_Latn | 0.1723 | 0.1683 | -0.0040 | 0.38 | 0.47 |
| zho_Hans | 0.7209 | 0.7211 | +0.0002 | 0.19 | 0.37 |
| zho_Hant | 0.7015 | 0.7057 | +0.0041 | 0.22 | 0.37 |
| zsm_Latn | 0.6526 | 0.6528 | +0.0002 | 0.27 | 0.37 |
| zul_Latn | 0.3583 | 0.3390 | -0.0193 | 0.38 | 0.44 |
| **平均** | **0.4811** | **0.4705** | **-0.0105** | 0.37 | 0.43 |

## 排行榜

| 排名 | 模型 | nDCG@10 |
|------|------|---------|
| #1 | Mira190/Euler-Legal-Embedding-V1 | 0.9692 |
| #2 | Qwen/Qwen3-Embedding-8B | 0.9662 |
| #3 | Octen/Octen-Embedding-8B | 0.9646 |
| #4 | Qwen/Qwen3-VL-Embedding-8B | 0.9607 |
| #5 | LingoIITGN/qwen-indic-v1 | 0.9516 |
| #6 | BAAI/bge-multilingual-gemma2 | 0.9500 |
| #7 | Octen/Octen-Embedding-4B | 0.9462 |
| #8 | Qwen/Qwen3-VL-Embedding-2B | 0.9443 |
| #9 | clips/e5-base-trm-nl | 0.9380 |
| #10 | clips/e5-large-trm-nl | 0.9305 |
| #11 | clips/e5-small-trm-nl | 0.9244 |
| #12 | Qwen/Qwen3-Embedding-4B | 0.9219 |
| #13 | Alibaba-NLP/gte-Qwen2-7B-instruct | 0.9203 |
| #14 | ICT-TIME-and-Querit/ICT-TIME-and-Querit-embedding-v1 | 0.9058 |
| #15 | ICT-TIME-and-Querit/BOOM_4B_v1 | 0.9031 |
| #16 | BidirLM/BidirLM-Omni-2.5B-Embedding | 0.9030 |
| #17 | SamilPwC-AXNode-GenAI/PwC-Embedding_expr | 0.8967 |
| #18 | Cohere/Cohere-embed-multilingual-v3.0 | 0.8927 |
| #19 | Alibaba-NLP/gte-multilingual-base | 0.8920 |
| #20 | Bytedance/Seed1.6-embedding-1215 | 0.8912 |
| #21 | Octen/Octen-Embedding-0.6B | 0.8911 |
| #22 | BidirLM/BidirLM-1.7B-Embedding | 0.8849 |
| #23 | Lajavaness/bilingual-embedding-large | 0.8845 |
| #24 | BidirLM/BidirLM-1B-Embedding | 0.8779 |
| #25 | BAAI/bge-m3 | 0.8778 |
| #26 | Alibaba-NLP/gte-Qwen2-1.5B-instruct | 0.8739 |
| #27 | OrdalieTech/Solon-embeddings-large-0.1 | 0.8737 |
| #28 | GritLM/GritLM-7B | 0.8530 |
| #29 | IEITYuan/Yuan-embedding-2.0-en | 0.8521 |
| #30 | GritLM/GritLM-8x7B | 0.8491 |
| #31 | Qwen/Qwen3-Embedding-0.6B | 0.8486 |
| #32 | Lajavaness/bilingual-embedding-base | 0.8480 |
| #33 | HIT-TMG/KaLM-embedding-multilingual-mini-v1 | 0.8427 |
| #34 | codefuse-ai/F2LLM-0.6B | 0.8384 |
| #35 | Salesforce/SFR-Embedding-Mistral | 0.8329 |
| #36 | Cohere/Cohere-embed-multilingual-light-v3.0 | 0.8292 |
| #37 | BidirLM/BidirLM-0.6B-Embedding | 0.8258 |
| #38 | Linq-AI-Research/Linq-Embed-Mistral | 0.8239 |
| #39 | Salesforce/SFR-Embedding-2_R | 0.8082 |
| #40 | Lajavaness/bilingual-embedding-small | 0.8036 |
| #41 | Alibaba-NLP/gte-Qwen1.5-7B-instruct | 0.7793 |
| #42 | HIT-TMG/KaLM-embedding-multilingual-mini-instruct-v1 | 0.7389 |
| #43 | BidirLM/BidirLM-270M-Embedding | 0.7361 |
| #44 | Omartificial-Intelligence-Space/Arabert-all-nli-triplet-Matryoshka | 0.7360 |
| #45 | Sailesh97/Hinvec | 0.7247 |
| #46 | Omartificial-Intelligence-Space/Arabic-all-nli-triplet-Matryoshka | 0.7136 |
| #47 | Omartificial-Intelligence-Space/Marbert-all-nli-triplet-Matryoshka | 0.7003 |
| #48 | Omartificial-Intelligence-Space/Arabic-labse-Matryoshka | 0.6788 |
| #49 | NovaSearch/jasper_en_vision_language_v1 | 0.6391 |
| #50 | NovaSearch/stella_en_1.5B_v5 | 0.6054 |
| #51 | BakaSearch（纯 BM25） | 0.4811 ← |
| #52 | BakaSearch（+桥扩展） | 0.4705 ← |
| #53 | Omartificial-Intelligence-Space/Arabic-mpnet-base-all-nli-triplet | 0.4646 |
| #54 | DeepPavlov/rubert-base-cased | 0.4369 |
| #55 | Haon-Chen/speed-embedding-7b-instruct | 0.4044 |
| #56 | bigscience/sgpt-bloom-7b1-msmarco | 0.2051 |
| #57 | Cohere/Cohere-embed-english-v3.0 | 0.1958 |
| #58 | VPLabs/SearchMap_Preview | 0.1929 |
| #59 | NovaSearch/stella_en_400M_v5 | 0.1894 |
| #60 | Jaume/gemma-2b-embeddings | 0.1302 |
| #61 | avsolatorio/GIST-large-Embedding-v0 | 0.1002 |
| #62 | BAAI/bge-base-en-v1.5 | 0.0990 |
| #63 | Cohere/Cohere-embed-english-light-v3.0 | 0.0851 |
| #64 | avsolatorio/GIST-Embedding-v0 | 0.0827 |
| #65 | BAAI/bge-large-en-v1.5 | 0.0804 |
| #66 | WhereIsAI/UAE-Large-V1 | 0.0750 |
| #67 | avsolatorio/GIST-small-Embedding-v0 | 0.0649 |
| #68 | Snowflake/snowflake-arctic-embed-m-long | 0.0623 |
| #69 | avsolatorio/NoInstruct-small-Embedding-v0 | 0.0606 |
| #70 | BAAI/bge-small-en-v1.5 | 0.0572 |
| #71 | Snowflake/snowflake-arctic-embed-m-v1.5 | 0.0551 |
| #72 | abhinand/MedEmbed-small-v0.1 | 0.0546 |
| #73 | Mihaiii/Ivysaur | 0.0545 |
| #74 | Snowflake/snowflake-arctic-embed-l | 0.0507 |
| #75 | Snowflake/snowflake-arctic-embed-s | 0.0446 |
| #76 | Mihaiii/Squirtle | 0.0426 |
| #77 | Snowflake/snowflake-arctic-embed-m | 0.0426 |
| #78 | aari1995/German_Semantic_STS_V2 | 0.0389 |
| #79 | Mihaiii/Venusaur | 0.0341 |
| #80 | Mihaiii/Wartortle | 0.0332 |
| #81 | Snowflake/snowflake-arctic-embed-xs | 0.0309 |
| #82 | DeepPavlov/rubert-base-cased-sentence | 0.0291 |
| #83 | ai-forever/ru-en-RoSBERTa | 0.0260 |
| #84 | ai-forever/sbert_large_mt_nlu_ru | 0.0243 |
| #85 | ai-forever/sbert_large_nlu_ru | 0.0234 |
| #86 | Mihaiii/Bulbasaur | 0.0211 |
| #87 | DeepPavlov/distilrubert-small-cased-conversational | 0.0194 |
| #88 | Mihaiii/gte-micro | 0.0168 |
| #89 | brahmairesearch/slx-v0.1 | 0.0157 |
| #90 | Mihaiii/gte-micro-v4 | 0.0154 |

