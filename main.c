#include<stdio.h>
#include<math.h>
#include<stdlib.h>

void clear_input_buffer(void);
void input_drop_rates(double *r);
void input_roll_cost(long double *c);
long int roll_num_calculation(double drop_rates, double significance_level);
long double sum_costs_calculation(long double roll_cost, long int roll_num);
#define NUMBER_LEVEL 6

int main(void){
    double drop_rates = 0;
    long double roll_cost = 0;


    input_drop_rates(&drop_rates);
    input_roll_cost(&roll_cost);

    printf("----少なくとも1回当たるまでに必要なガチャ回数、必要金額を計算します。----\n");

    double significance_level[NUMBER_LEVEL] = {0.5, 0.2, 0.1, 0.05, 0.01, 0.001};
    
    for(int i = 0; i < NUMBER_LEVEL; i++){
        long int roll_num = roll_num_calculation(drop_rates, significance_level[i]);
        long double sum_costs = sum_costs_calculation(roll_cost, roll_num);

        printf("%ld回引くと%.1f[%%]の確率で少なくとも1回は当たります。\nこのとき、%.2Lf円かかります。\n\n", roll_num, 100 - significance_level[i] * 100, sum_costs);
    }


    return 0;
}

void clear_input_buffer(void){
    int c;
    while ((c = getchar()) != '\n' && c != EOF);
}

void input_drop_rates(double *r){
    while(1){
        printf("ガチャ確率を入力してください。（0<[確率]<100, 小数第5位まで入力可能）\n");
        printf("確率[%%]：");
        
        if(scanf("%lf", r) != 1){
            printf("＊エラー\n入力が無効です。再入力してください！\n\n");
            clear_input_buffer();
            continue;
        }
        else if(*r < 0.00001 || *r >= 100){
            printf("＊エラー\n入力が無効です。『0<[確率]<100, 小数第5位まで』の範囲内で入力してください！\n\n");
            clear_input_buffer();
            continue;
        }
        else break;
    }
    *r = round(*r * 100000) / 100000;
    *r /= 100;
}

void input_roll_cost(long double *c){
    while(1){
        printf("ガチャ1回あたりにかかる金額を入力してください（0<[金額]<1000, 小数第2位まで入力可能）\n");
        printf("金額[円/回]：");
        
        if(scanf("%Lf", c) != 1){
            printf("＊エラー\n入力が無効です。再入力してください！\n\n");
            clear_input_buffer();
            continue;
        }
        else if(*c < 0.01 || *c >= 1000){
            printf("＊エラー\n入力が無効です。『0<[金額]<1000, 小数第2位まで』の範囲内で入力してください！\n\n");
            clear_input_buffer();
            continue;
        }
        else break;
    }
    *c = round(*c * 100) / 100;
}

long int roll_num_calculation(double drop_rates, double significance_level){
    return (long) ceil(log(significance_level)/log(1 - drop_rates));
}

long double sum_costs_calculation(long double roll_cost, long int roll_num){
    return roll_cost * roll_num;
}
